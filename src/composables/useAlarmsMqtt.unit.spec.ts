import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import PrimeVue from "primevue/config";
import type { AlarmLevel, AlarmMetric } from "@/types/alarm";

const { FakeMqttClient } = vi.hoisted(() => {
  class FakeMqttClient {
    static instances: FakeMqttClient[] = [];

    readonly url: string;
    readonly options: { reconnectPeriod?: number } | undefined;
    subscribe = vi.fn();
    publish = vi.fn();
    end = vi.fn();
    removeAllListeners = vi.fn(() => {
      this.handlers.clear();
    });

    private handlers = new Map<string, Array<(...args: unknown[]) => void>>();

    constructor(url: string, options?: { reconnectPeriod?: number }) {
      this.url = url;
      this.options = options;
      FakeMqttClient.instances.push(this);
    }

    on(event: string, handler: (...args: unknown[]) => void) {
      const list = this.handlers.get(event) ?? [];
      list.push(handler);
      this.handlers.set(event, list);
      return this;
    }

    triggerConnect() {
      this.handlers.get("connect")?.forEach((h) => h());
    }

    triggerMessage(topic: string, data: string) {
      this.handlers.get("message")?.forEach((h) => h(topic, { toString: () => data }));
    }

    triggerError() {
      this.handlers.get("error")?.forEach((h) => h(new Error("fail")));
    }

    triggerClose() {
      this.handlers.get("offline")?.forEach((h) => h());
    }

    static latest() {
      return FakeMqttClient.instances[FakeMqttClient.instances.length - 1];
    }
  }

  return { FakeMqttClient };
});

vi.mock("mqtt", () => ({
  default: {
    connect: (url: string, options?: { reconnectPeriod?: number }) =>
      new FakeMqttClient(url, options),
  },
}));

import { useAlarmsMqtt } from "./useAlarmsMqtt";

const HostComponent = defineComponent({
  setup() {
    return useAlarmsMqtt();
  },
  template: "<div />",
});

const VALID_ALARM = {
  metric: "core_temperature",
  level: "danger",
  value: 1050,
  ts: "2026-09-07T03:32:09.976515+00:00",
};

function mountComposable() {
  const wrapper = mount(HostComponent, {
    global: {
      plugins: [[PrimeVue, { theme: "none" }]],
    },
  });

  const vm = wrapper.vm as unknown as {
    hasData: boolean;
    connectionError: string | null;
    alarms: Partial<Record<AlarmMetric, typeof VALID_ALARM>>;
    ackedLevel: Partial<Record<AlarmMetric, AlarmLevel>>;
    ack: (metric: AlarmMetric) => void;
  };

  return { wrapper, vm };
}

beforeEach(() => {
  FakeMqttClient.instances = [];
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useAlarmsMqtt", () => {
  it("connects to VITE_MQTT_URL and subscribes to snrub/alarms/# at QoS 0", () => {
    mountComposable();
    const client = FakeMqttClient.latest();

    expect(FakeMqttClient.instances).toHaveLength(1);
    expect(client.url).toBe("ws://localhost:8083/mqtt");

    client.triggerConnect();

    expect(client.subscribe).toHaveBeenCalledWith("snrub/alarms/#", { qos: 0 });
  });

  it("applies a valid retained-style alarm message", () => {
    const { vm } = mountComposable();
    const client = FakeMqttClient.latest();

    client.triggerConnect();
    client.triggerMessage("snrub/alarms/core_temperature", JSON.stringify(VALID_ALARM));

    expect(vm.hasData).toBe(true);
    expect(vm.alarms.core_temperature).toEqual(VALID_ALARM);
  });

  it("skips inbound ack topics without mutating state", () => {
    const { vm } = mountComposable();
    const client = FakeMqttClient.latest();

    client.triggerMessage("snrub/alarms/core_temperature/ack", JSON.stringify(VALID_ALARM));

    expect(vm.hasData).toBe(false);
    expect(vm.alarms.core_temperature).toBeUndefined();
  });

  it("drops malformed JSON without throwing or mutating state", () => {
    const { vm } = mountComposable();
    const client = FakeMqttClient.latest();

    client.triggerMessage("snrub/alarms/core_temperature", "not-valid-json{{{");

    expect(vm.hasData).toBe(false);
  });

  it("drops schema-invalid payloads without mutating state", () => {
    const { vm } = mountComposable();
    const client = FakeMqttClient.latest();

    client.triggerMessage(
      "snrub/alarms/core_temperature",
      JSON.stringify({ ...VALID_ALARM, level: "critical" }),
    );

    expect(vm.hasData).toBe(false);
  });

  it("publishes a non-retained ack and stays acked until the level changes", () => {
    const { vm } = mountComposable();
    const client = FakeMqttClient.latest();

    client.triggerConnect();
    client.triggerMessage("snrub/alarms/core_temperature", JSON.stringify(VALID_ALARM));

    vm.ack("core_temperature");

    expect(client.publish).toHaveBeenCalledWith(
      "snrub/alarms/core_temperature/ack",
      expect.any(String),
      { qos: 0, retain: false },
    );
    const body = JSON.parse(client.publish.mock.calls[0][1] as string) as {
      metric: string;
      acked_level: string;
      acked_at: string;
    };
    expect(body.metric).toBe("core_temperature");
    expect(body.acked_level).toBe("danger");
    expect(body.acked_at).toMatch(/^\d{4}-/);
    expect(vm.ackedLevel.core_temperature).toBe("danger");

    client.triggerMessage(
      "snrub/alarms/core_temperature",
      JSON.stringify({ ...VALID_ALARM, value: 1060 }),
    );
    expect(vm.ackedLevel.core_temperature).toBe("danger");

    client.triggerMessage(
      "snrub/alarms/core_temperature",
      JSON.stringify({ ...VALID_ALARM, level: "warning", value: 950 }),
    );
    expect(vm.ackedLevel.core_temperature).toBeUndefined();
  });

  it("sets connectionError on offline and does not create a new client", () => {
    const { vm } = mountComposable();
    const client = FakeMqttClient.latest();

    client.triggerClose();

    expect(vm.connectionError).toContain("Reconnecting");
    expect(FakeMqttClient.instances).toHaveLength(1);
  });

  it("ends the client on unmount and does not reconnect", () => {
    vi.useFakeTimers();
    const { wrapper } = mountComposable();
    const client = FakeMqttClient.latest();

    wrapper.unmount();

    expect(client.end).toHaveBeenCalledWith(true);
    vi.advanceTimersByTime(5000);
    expect(FakeMqttClient.instances).toHaveLength(1);
  });
});
