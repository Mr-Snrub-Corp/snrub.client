import mqtt from "mqtt";
import type { MqttClient } from "mqtt";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { isAlarmAckTopic, parseAlarmPayload } from "@/utils/alarm";
import type { AlarmLevel, AlarmMetric, AlarmPayload } from "@/types/alarm";

const ALARMS_TOPIC = "snrub/alarms/#";
const RECONNECT_MS = 1000;

/**
 * Subscribes to retained per-metric alarm levels over MQTT-over-WebSocket.
 *
 * Owns connect / subscribe / teardown (onMounted / onBeforeUnmount). Ack is
 * client-local: a tile stays silenced until that metric's level changes.
 */
export function useAlarmsMqtt() {
  const alarms = reactive<Partial<Record<AlarmMetric, AlarmPayload>>>({});
  const ackedLevel = reactive<Partial<Record<AlarmMetric, AlarmLevel>>>({});
  const hasData = ref(false);
  const connectionError = ref<string | null>(null);

  let client: MqttClient | null = null;
  let intentionalClose = false;

  function handleMessage(topic: string, payload: { toString(): string }): void {
    if (isAlarmAckTopic(topic)) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(payload.toString());
    } catch {
      return;
    }

    const data = parseAlarmPayload(parsed);
    if (!data) return;

    const prevAck = ackedLevel[data.metric];
    if (prevAck !== undefined && prevAck !== data.level) {
      delete ackedLevel[data.metric];
    }

    alarms[data.metric] = data;
    hasData.value = true;
    connectionError.value = null;
  }

  function ack(metric: AlarmMetric): void {
    const current = alarms[metric];
    if (!current || current.level === "normal") return;
    if (ackedLevel[metric] === current.level) return;

    const body = {
      metric,
      acked_at: new Date().toISOString(),
      acked_level: current.level,
    };
    client?.publish(`snrub/alarms/${metric}/ack`, JSON.stringify(body), { qos: 0, retain: false });
    ackedLevel[metric] = current.level;
  }

  function connect(): void {
    if (intentionalClose) return;

    const mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_URL, {
      reconnectPeriod: RECONNECT_MS,
    });
    client = mqttClient;

    mqttClient.on("connect", () => {
      if (client !== mqttClient) return;
      mqttClient.subscribe(ALARMS_TOPIC, { qos: 0 });
      if (hasData.value) connectionError.value = null;
    });

    mqttClient.on("message", (topic, payload) => {
      if (client !== mqttClient) return;
      handleMessage(topic, payload);
    });

    mqttClient.on("error", () => {
      if (client !== mqttClient) return;
      connectionError.value = hasData.value
        ? "Alarms connection error. Reconnecting…"
        : "Unable to connect to alarms.";
    });

    mqttClient.on("offline", () => {
      if (client !== mqttClient) return;
      if (intentionalClose) return;
      connectionError.value = hasData.value
        ? "Alarms connection lost. Reconnecting…"
        : "Unable to connect to alarms. Reconnecting…";
    });
  }

  onMounted(connect);

  onBeforeUnmount(() => {
    intentionalClose = true;
    if (client === null) return;
    const old = client;
    client = null;
    old.removeAllListeners();
    old.end(true);
  });

  return {
    alarms,
    ackedLevel,
    hasData,
    connectionError,
    ack,
  };
}
