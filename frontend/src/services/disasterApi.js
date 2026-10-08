// src/services/disasterApi.js

import { getIncidents } from "./demoStore";

/*
  ResQ-AI Disaster Feed

  For now this uses demo/local incident data.

  Later your backend friend can replace the inside of
  getActiveDisasterAlerts() with the real disaster API call.

  The rest of the frontend will NOT need to change.
*/

export const getActiveDisasterAlerts = () => {
  const incidents = getIncidents();

  if (!Array.isArray(incidents)) {
    return [];
  }

  return incidents
    .filter((incident) => {
      const severity = String(
        incident.severity || ""
      ).toLowerCase();

      return (
        severity === "medium" ||
        severity === "high" ||
        severity === "critical"
      );
    })
    .map((incident) => ({
      id: incident.id,

      source: "ResQ Incident Feed",

      type:
        incident.type ||
        incident.incident ||
        "Emergency",

      title:
        incident.title ||
        incident.type ||
        "Disaster Alert",

      description:
        incident.description ||
        "Active emergency detected.",

      severity:
        incident.severity || "Medium",

      affectedPeople:
        incident.affectedPeople ??
        incident.affected ??
        0,

      needs:
        Array.isArray(incident.needs)
          ? incident.needs
          : [],

      location: {
        latitude:
          incident.location?.latitude ??
          null,

        longitude:
          incident.location?.longitude ??
          null,

        address:
          incident.location?.address ||
          "Affected area",
      },

      createdAt:
        incident.createdAt ||
        new Date().toISOString(),

      updatedAt:
        incident.updatedAt ||
        new Date().toISOString(),
    }));
};