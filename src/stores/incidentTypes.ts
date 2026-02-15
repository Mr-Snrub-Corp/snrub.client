import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/httpService";
import type { IncidentType, IncidentTypeCreate } from "@/types/incidentType";

export const useIncidentTypesStore = defineStore("incidentTypes", () => {
  // State
  const incidentTypes = ref<Record<string, IncidentType>>({});

  // Getters
  const getAllIncidentTypes = computed(() => Object.values(incidentTypes.value));
  const getIncidentTypeById = computed(() => (uid: string) => {
    return incidentTypes.value[uid];
  });

  // Actions
  async function createIncidentType(data: IncidentTypeCreate) {
    try {
      const response = await api.incidentTypes.create(data);
      incidentTypes.value[response.uid] = response;
      return response;
    } catch (err) {
      console.error("Error creating incident type:", err);
      throw err;
    }
  }

  async function fetchIncidentTypes() {
    try {
      const response = await api.incidentTypes.get();
      const map: Record<string, IncidentType> = {};
      response.forEach((type: IncidentType) => {
        map[type.uid] = type;
      });
      incidentTypes.value = map;
      return response;
    } catch (err) {
      console.error("Error fetching incident types:", err);
      throw err;
    }
  }

  async function fetchIncidentTypeById(uid: string) {
    try {
      const response = await api.incidentTypes.getOne(uid);
      incidentTypes.value[uid] = response;
      return response;
    } catch (err) {
      console.error(`Error fetching incident type ${uid}:`, err);
      throw err;
    }
  }

  async function updateIncidentType(uid: string, data: Partial<IncidentType>) {
    try {
      const response = await api.incidentTypes.updateOne(uid, data);
      incidentTypes.value[uid] = { ...incidentTypes.value[uid], ...response };
      return response;
    } catch (err) {
      console.error(`Error updating incident type ${uid}:`, err);
      throw err;
    }
  }

  return {
    incidentTypes,
    getAllIncidentTypes,
    getIncidentTypeById,
    createIncidentType,
    fetchIncidentTypes,
    fetchIncidentTypeById,
    updateIncidentType,
  };
});
