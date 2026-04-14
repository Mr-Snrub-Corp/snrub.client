<template>
  <div class="px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8 bg-surface-50 dark:bg-surface-950">
    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-8">Incident Types</h1>

    <!-- Skeleton loader -->
    <div v-if="isLoading" class="flex flex-col gap-8">
      <div v-for="i in 2" :key="i">
        <Skeleton width="12rem" height="1.75rem" class="mb-2" />
        <Skeleton width="24rem" height="1rem" class="mb-4" />
        <DataTable :value="skeletonRows" class="shadow-sm rounded-2xl overflow-hidden">
          <Column header="Name">
            <template #body><Skeleton /></template>
          </Column>
          <Column header="Description">
            <template #body><Skeleton /></template>
          </Column>
          <Column header="Default Severity">
            <template #body><Skeleton width="3rem" /></template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Category groups -->
    <div v-else class="flex flex-col gap-10">
      <div
        v-for="group in groupedByCategory"
        :key="group.category.uid"
        data-testid="incidents.types.category-group"
      >
        <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-1">
          {{ group.category.name }}
        </h2>
        <p
          v-if="group.category.description"
          class="text-surface-500 dark:text-surface-400 mb-4 text-sm"
        >
          {{ group.category.description }}
        </p>
        <DataTable
          :value="group.types"
          class="shadow-sm rounded-2xl overflow-hidden"
          data-testid="incidents.types.table"
        >
          <template #empty>No incident types in this category.</template>
          <Column field="name" header="Name" />
          <Column field="description" header="Description" />
          <Column field="default_severity" header="Default Severity">
            <template #body="slotProps">
              <SeverityBadge :severity="slotProps.data.default_severity" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";
import SeverityBadge from "@/components/SeverityBadge.vue";
import { useIncidentCategoriesStore } from "@/stores/incidentCategories";
import { useIncidentTypesStore } from "@/stores/incidentTypes";

const categoriesStore = useIncidentCategoriesStore();
const typesStore = useIncidentTypesStore();

const isLoading = ref(true);
const skeletonRows = new Array(4).fill({});

const groupedByCategory = computed(() => {
  const categories = categoriesStore.getAllIncidentCategories;
  const types = typesStore.getAllIncidentTypes;

  return categories.map((category) => ({
    category,
    types: types.filter((t) => t.category_id === category.uid),
  }));
});

onBeforeMount(async () => {
  await Promise.all([
    categoriesStore.fetchIncidentCategories(),
    // TODO check if this has already been loaded
    typesStore.fetchIncidentTypes(),
  ]);
  isLoading.value = false;
});
</script>

<style scoped></style>
