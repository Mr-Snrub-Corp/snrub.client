import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/httpService";
import type { GodModeLever, LeverState } from "@/types/godMode";
import type { IncidentStatus } from "@/types/incidentReport";

export const useGodModeStore = defineStore("godMode", () => {
  // State: lever key -> current state
  const levers = ref<Record<string, LeverState>>({});

  // Getters
  const getAllLevers = computed(() => Object.values(levers.value));
  const getLeverState = computed(() => (lever: GodModeLever) => levers.value[lever]);

  // Actions
  async function fetchLevers() {
    try {
      const response: LeverState[] = await api.godmode.getLevers();
      const map: Record<string, LeverState> = {};
      response.forEach((state) => {
        map[state.lever] = state;
      });
      levers.value = map;
      return response;
    } catch (err) {
      console.error("Error fetching god-mode levers:", err);
      throw err;
    }
  }

  async function setLever(lever: GodModeLever, status: IncidentStatus) {
    try {
      const response: LeverState = await api.godmode.setLever(lever, { status });
      levers.value[response.lever] = response;
      return response;
    } catch (err) {
      console.error(`Error setting god-mode lever ${lever}:`, err);
      throw err;
    }
  }

  function $reset() {
    levers.value = {};
  }

  return {
    levers,
    getAllLevers,
    getLeverState,
    fetchLevers,
    setLever,
    $reset,
  };
});
