import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/services/httpService";
import type { IncidentCategory } from "@/types/incidentCategory";

export const useIncidentCategoriesStore = defineStore("incidentCategories", () => {
  const incidentCategories = ref<Record<string, IncidentCategory>>({});

  const getAllIncidentCategories = computed(() => Object.values(incidentCategories.value));

  async function fetchIncidentCategories() {
    try {
      const response = await api.incidentCategories.get();
      const map: Record<string, IncidentCategory> = {};
      response.forEach((category: IncidentCategory) => {
        map[category.uid] = category;
      });
      incidentCategories.value = map;
      return response;
    } catch (err) {
      console.error("Error fetching incident categories:", err);
      throw err;
    }
  }

  function $reset() {
    incidentCategories.value = {};
  }

  return {
    incidentCategories,
    $reset,
    getAllIncidentCategories,
    fetchIncidentCategories,
  };
});
