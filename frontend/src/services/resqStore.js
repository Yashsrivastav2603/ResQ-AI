const STORAGE_KEY = "resq-ai-incidents";

const defaultIncidents = [
  {
    id: "RQ-001",
    type: "Flood",
    severity: "Critical",
    location: "Sector 12",
    affected: 50,
    verifiedAffected: 27,
    rescueRequests: 12,
    status: "Pending Verification",
    source: "Citizen",
    confidence: 0.91,
    createdAt: new Date().toISOString(),
    needs: ["Rescue Team", "Medical Team", "Food"],
    aiAnalysis: {
      disasterType: "Flood",
      urgency: "Critical",
      peopleAtRisk: 50,
      medicalEmergency: true,
      roadBlocked: true,
      confidence: 0.91
    }
  },
  {
    id: "RQ-002",
    type: "Landslide",
    severity: "High",
    location: "Hill Road",
    affected: 25,
    verifiedAffected: 0,
    rescueRequests: 5,
    status: "Pending Verification",
    source: "Citizen",
    confidence: 0.86,
    createdAt: new Date().toISOString(),
    needs: ["Rescue Team"],
    aiAnalysis: {
      disasterType: "Landslide",
      urgency: "High",
      peopleAtRisk: 25,
      medicalEmergency: false,
      roadBlocked: true,
      confidence: 0.86
    }
  }
];

function getIncidents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultIncidents)
      );

      return defaultIncidents;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error("Unable to read incidents:", error);
    return defaultIncidents;
  }
}

function saveIncidents(incidents) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(incidents)
  );

  window.dispatchEvent(new Event("resq-incidents-updated"));
}

export function addIncident(incident) {
  const incidents = getIncidents();

  const newIncident = {
    id: `RQ-${String(incidents.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    status: "Pending Verification",
    ...incident
  };

  saveIncidents([newIncident, ...incidents]);

  return newIncident;
}

export function updateIncident(id, updates) {
  const incidents = getIncidents();

  const updated = incidents.map((incident) =>
    incident.id === id
      ? {
          ...incident,
          ...updates
        }
      : incident
  );

  saveIncidents(updated);

  return updated.find((incident) => incident.id === id);
}

export function getIncident(id) {
  return getIncidents().find(
    (incident) => incident.id === id
  );
}

export function clearIncidents() {
  localStorage.removeItem(STORAGE_KEY);
}

export { getIncidents };