import { useIncidentTypesStore } from "@/stores/incidentTypes";

/**
 * Resolves an incident type's name from the store, falling back to an empty
 * string. Replaces the `getIncidentTypeName` helper duplicated across views.
 */
export function useIncidentTypeLookup() {
  const incidentTypesStore = useIncidentTypesStore();

  function getIncidentTypeName(incidentTypeId: string): string {
    return incidentTypesStore.getIncidentTypeById(incidentTypeId)?.name ?? "";
  }

  return { getIncidentTypeName };
}
