import { request, users } from "./coreApi";

const TYPE_MAP = {
  flood: "FLOOD",
  fire: "FIRE",
  earthquake: "EARTHQUAKE",
  landslide: "LANDSLIDE",
  cyclone: "CYCLONE",
  "road blockage": "ROAD_BLOCKAGE",
  medical: "MEDICAL_EMERGENCY",
};

const SEVERITY_MAP = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
};

/**
 * Sends a citizen report to the Spring Boot backend.
 * If the browser did not share GPS on the form, falls back to the
 * location the user registered with, because the backend requires coordinates.
 */
export async function reportIncidentToBackend({
  analysis,
  description,
  location,
  affectedNumber,
}) {
  let latitude = location?.latitude;
  let longitude = location?.longitude;
  let locationLabel = location ? "Reported via GPS" : null;

  if (latitude == null || longitude == null) {
    const me = await users.me();
    latitude = me?.location?.latitude;
    longitude = me?.location?.longitude;
    locationLabel = me?.location?.displayName || null;
  }

  if (latitude == null || longitude == null) {
    throw new Error("No location available for this report.");
  }

  return request("/api/v1/incidents", {
    method: "POST",
    body: {
      type: TYPE_MAP[(analysis.incident || "").toLowerCase()] || "OTHER",
      severity: SEVERITY_MAP[(analysis.severity || "").toLowerCase()] || "MEDIUM",
      description:
        description.trim() || "Emergency reported through citizen emergency form.",
      latitude,
      longitude,
      locationLabel,
      affectedCount: affectedNumber,
      needs: Array.isArray(analysis.needs) ? analysis.needs : [],
    },
  });
}
