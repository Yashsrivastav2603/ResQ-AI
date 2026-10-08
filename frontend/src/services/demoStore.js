const STORAGE_KEY = "resqai_incidents";

const notifyIncidentChange = () => {
  window.dispatchEvent(new Event("resqai-incidents-updated"));
};

export function getIncidents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const incidents = JSON.parse(saved);

    if (!Array.isArray(incidents)) {
      return [];
    }

    return incidents;
  } catch (error) {
    console.error("Could not read incidents:", error);
    return [];
  }
}

export function saveIncident(incident) {
  const incidents = getIncidents();

  const now = new Date().toISOString();

  const newIncident = {
    ...incident,

    id: incident.id || `RQ-${Date.now()}`,

    createdAt: incident.createdAt || now,

    updatedAt: incident.updatedAt || now,

    status: incident.status || "Pending Verification",

    statusHistory: incident.statusHistory || [
      {
        status: incident.status || "Pending Verification",
        timestamp: now,
        note: "Incident reported by citizen",
      },
    ],
  };

  const updatedIncidents = [
    newIncident,
    ...incidents,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedIncidents)
  );

  notifyIncidentChange();

  return newIncident;
}

export function updateIncidentStatus(id, status, note = "") {
  const incidents = getIncidents();

  const now = new Date().toISOString();

  const updatedIncidents = incidents.map((incident) => {
    if (incident.id !== id) {
      return incident;
    }

    const history = Array.isArray(incident.statusHistory)
      ? incident.statusHistory
      : [];

    const lastStatus =
      history.length > 0
        ? history[history.length - 1].status
        : incident.status;

    // Don't create duplicate timeline entries
    if (lastStatus === status) {
      return {
        ...incident,
        updatedAt: now,
      };
    }

    const newHistoryEntry = {
      status,
      timestamp: now,
      note:
        note ||
        `Incident status changed to ${status}`,
    };

    return {
      ...incident,

      status,

      updatedAt: now,

      statusHistory: [
        ...history,
        newHistoryEntry,
      ],
    };
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedIncidents)
  );

  notifyIncidentChange();

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

  notifyIncidentChange();

  return updatedIncidents;
}

export function deleteIncident(id) {
  const incidents = getIncidents();

  const updatedIncidents = incidents.filter(
    (incident) => incident.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedIncidents)
  );

  notifyIncidentChange();

  return updatedIncidents;
}