// src/services/alertEngine.js

export const ALERT_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const shouldAlertUser = (severity) => {
  const normalized = String(
    severity || ""
  ).toLowerCase();

  return (
    normalized === "medium" ||
    normalized === "high" ||
    normalized === "critical"
  );
};

export const shouldPlayAlarm = (severity) => {
  const normalized = String(
    severity || ""
  ).toLowerCase();

  return (
    normalized === "high" ||
    normalized === "critical"
  );
};

export const isCritical = (severity) => {
  return (
    String(severity || "").toLowerCase() ===
    "critical"
  );
};

export const getAlertPriority = (severity) => {
  const normalized = String(
    severity || ""
  ).toLowerCase();

  if (normalized === "critical") {
    return 3;
  }

  if (normalized === "high") {
    return 2;
  }

  if (normalized === "medium") {
    return 1;
  }

  return 0;
};

export const getAlertMessage = (severity) => {
  const normalized = String(
    severity || ""
  ).toLowerCase();

  if (normalized === "critical") {
    return "Immediate emergency response required.";
  }

  if (normalized === "high") {
    return "High-risk disaster detected nearby.";
  }

  if (normalized === "medium") {
    return "Stay alert and check the recommended safe locations.";
  }

  return "Disaster information available.";
};