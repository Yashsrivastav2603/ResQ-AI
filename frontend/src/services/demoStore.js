
const STORAGE_KEY = "resqai_incidents";

export function getIncidents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not read incidents:", error);
    return [];
  }
}

export function saveIncident(incident) {
  const incidents = getIncidents();

  const updatedIncident = {
    ...incident,
    id: incident.id || `RQ-${Date.now()}`,
    createdAt: incident.createdAt || new Date().toISOString(),
    status: incident.status || "Pending Verification",
  };

  const updatedIncidents = [updatedIncident, ...incidents];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedIncidents)
  );

  return updatedIncident;
}

export function updateIncidentStatus(id, status) {
  const incidents = getIncidents();

  const updatedIncidents = incidents.map((incident) =>
    incident.id === id
      ? {
          ...incident,
          status,
          updatedAt: new Date().toISOString(),
        }
      : incident
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedIncidents)
  );

  return updatedIncidents;
}
export function updateIncident(id, updates) {
  const incidents = getIncidents();

  const updatedIncidents = incidents.map((incident) =>
    incident.id === id
      ? {
          ...incident,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : incident
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedIncidents)
  );

  return updatedIncidents;
}