
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DisasterMap from "../components/DisasterMap";
import {
  getIncidents,
  updateIncidentStatus,
} from "../services/demoStore";

function AuthorityDashboard() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const selectedIncidentRef = useRef(null);

  const navigate = useNavigate();
useEffect(() => {
  const loadIncidents = () => {
    setIncidents(getIncidents());
  };

  // Load incidents when dashboard opens
  loadIncidents();

  // Handle updates from another browser tab
  const handleStorageChange = () => {
    loadIncidents();
  };

  // Handle updates from the same browser tab
  const handleIncidentUpdate = () => {
    loadIncidents();
  };

  window.addEventListener(
    "storage",
    handleStorageChange
  );

  window.addEventListener(
    "resqai-incidents-updated",
    handleIncidentUpdate
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorageChange
    );

    window.removeEventListener(
      "resqai-incidents-updated",
      handleIncidentUpdate
    );
  };
}, []);

 const handleStatusChange = (id, status) => {
  const updated = updateIncidentStatus(id, status);

  setIncidents(updated);

  setSelectedIncident((previous) => {
    if (!previous || previous.id !== id) return previous;

    return {
      ...previous,
      status,
      updatedAt: new Date().toISOString(),
    };
  });

  return updated;
};
useEffect(() => {
  if (selectedIncident && selectedIncidentRef.current) {
    setTimeout(() => {
      selectedIncidentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }
}, [selectedIncident]);

  const getLocationText = (location) => {
    if (!location) return "Location unavailable";

    if (typeof location === "object") {
      if (location.address) return location.address;

      if (
        location.latitude != null &&
        location.longitude != null
      ) {
        return `${location.latitude}, ${location.longitude}`;
      }

      return "Location unavailable";
    }

    return location;
  };

  const getAffectedPeople = (incident) => {
    return (
      incident.affectedPeople ??
      incident.affected ??
      "Not estimated"
    );
  };

  const getSeverityStyle = (severity) => {
    if (severity === "Critical") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (severity === "High") {
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
  };

  const criticalCount = incidents.filter(
    (incident) => incident.severity === "Critical"
  ).length;

  const highCount = incidents.filter(
    (incident) => incident.severity === "High"
  ).length;

  const totalAffected = incidents.reduce((total, incident) => {
    const value = incident.affectedPeople ?? incident.affected;
    const count =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value.replace(/\+/g, "").trim())
          : 0;

    return total + (Number.isFinite(count) ? count : 0);
  }, 0);

  // AI + Field Verification based resource recommendation
const verifiedAffectedPopulation =
  selectedIncident?.affectedEstimate
    ? parseInt(
        String(selectedIncident.affectedEstimate).replace(/\D/g, ""),
        10
      )
    : 0;

const rescueRequestCount =
  selectedIncident?.rescueRequests ||
  (selectedIncident?.needs?.some((need) =>
    need.toLowerCase().includes("rescue")
  )
    ? 10
    : 0);

const medicalCaseCount =
  selectedIncident?.medicalEmergency
    ? 5
    : selectedIncident?.needs?.some((need) =>
        need.toLowerCase().includes("medical")
      )
      ? 3
      : 0;

const recommendedAmbulances =
  selectedIncident?.severity === "Critical"
    ? Math.max(2, Math.ceil(medicalCaseCount / 3))
    : selectedIncident?.severity === "High"
      ? 1
      : 0;

const recommendedRescueTeams =
  rescueRequestCount >= 20
    ? 3
    : rescueRequestCount >= 10
      ? 2
      : rescueRequestCount > 0
        ? 1
        : 0;

const recommendedMedicalUnits =
  medicalCaseCount >= 5
    ? 2
    : medicalCaseCount > 0
      ? 1
      : 0;

const estimatedPopulation =
  verifiedAffectedPopulation > 0
    ? verifiedAffectedPopulation
    : selectedIncident?.affectedPeople || 0;

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#07101d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl ring-1 ring-cyan-400/30">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold">
                ResQ<span className="text-cyan-400">-AI</span>
              </h1>
              <p className="text-[10px] tracking-[0.25em] text-slate-500">
                DISASTER INTELLIGENCE
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-400 sm:block">
              ● SYSTEM OPERATIONAL
            </div>

            <Link
              to="/resources"
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
            >
              Resources →
            </Link>

            <Link
              to="/home"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-cyan-400">
            AUTHORITY CONTROL CENTER
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Disaster Response Dashboard
              </h2>

              <p className="mt-4 max-w-3xl text-slate-400">
                Monitor incidents, understand response priorities and review
                AI-generated resource recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
              <p className="text-xs text-slate-500">RESPONSE STATUS</p>
              <p className="mt-1 font-bold text-cyan-300">
                Monitoring Active
              </p>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-red-500/20 bg-[#081421] p-6">
            <p className="text-sm text-slate-500">Critical Incidents</p>
            <p className="mt-3 text-4xl font-black text-red-400">
              {String(criticalCount).padStart(2, "0")}
            </p>
            <p className="mt-2 text-xs text-red-400">
              Requires immediate review
            </p>
          </div>

          <div className="rounded-3xl border border-orange-500/20 bg-[#081421] p-6">
            <p className="text-sm text-slate-500">High Priority</p>
            <p className="mt-3 text-4xl font-black text-orange-400">
              {String(highCount).padStart(2, "0")}
            </p>
            <p className="mt-2 text-xs text-orange-400">
              Awaiting response
            </p>
          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-[#081421] p-6">
            <p className="text-sm text-slate-500">People Affected</p>
            <p className="mt-3 text-4xl font-black text-purple-300">
              {totalAffected}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Based on reported estimates
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-[#081421] p-6">
            <p className="text-sm text-slate-500">Resources Active</p>
            <p className="mt-3 text-4xl font-black text-cyan-400">08</p>
            <p className="mt-2 text-xs text-cyan-400">
              Demo resource count
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-orange-400/20 bg-orange-400/5 p-6">

  <div className="flex items-start gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-400/10 text-2xl">
      ⚠️
    </div>

    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-orange-300">
        FIELD VERIFICATION ALERT
      </p>

      <h3 className="mt-2 text-2xl font-black">
        Potentially Unreported Area
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
        No direct citizen report has been received from this
        area, but disaster indicators suggest that field
        verification may be required.
      </p>
    </div>

  </div>

  <div className="mt-5 grid gap-3 sm:grid-cols-4">

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        VILLAGE
      </p>
      <p className="mt-1 font-bold">
        Rampur
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        BASELINE POPULATION
      </p>
      <p className="mt-1 font-bold">
        500
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        CONNECTIVITY
      </p>
      <p className="mt-1 font-bold text-orange-300">
        Poor
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        REGIONAL HAZARD
      </p>
      <p className="mt-1 font-bold">
        Flood
      </p>
    </div>

  </div>

  <div className="mt-5 rounded-xl border border-white/10 bg-white/3 p-4">

    <p className="text-xs font-semibold tracking-widest text-slate-500">
      FIELD VERIFICATION
    </p>

    <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">

      <p>• Survey affected households</p>
      <p>• Estimate affected population</p>
      <p>• Identify rescue requests</p>
      <p>• Check medical emergencies</p>

    </div>

  </div>

  <button
    type="button"
    onClick={() =>
      alert(
        "Field verification task created for Rampur."
      )
    }
    className="mt-5 rounded-xl bg-orange-400 px-5 py-3 font-bold text-black transition hover:bg-orange-300"
  >
    Create Field Verification →
  </button>

</section>

{/* FIELD VERIFICATION SNAPSHOT */}
<section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
        FIELD VERIFICATION SNAPSHOT
      </p>

      <h3 className="mt-2 text-2xl font-black">
        Rampur Ground Verification
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
        Field volunteers can verify the actual situation when direct
        citizen reports are unavailable or incomplete.
      </p>
    </div>

    <div className="rounded-xl bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
      DEMO DATA
    </div>
  </div>

  {/* Population overview */}
  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">
        BASELINE POPULATION
      </p>

      <p className="mt-2 text-2xl font-black">
        500
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Village population
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">
        HOUSEHOLDS VERIFIED
      </p>

      <p className="mt-2 text-2xl font-black">
        52
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Ground survey completed
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">
        AFFECTED HOUSEHOLDS
      </p>

      <p className="mt-2 text-2xl font-black">
        86
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Estimated from field inputs
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">
        AFFECTED POPULATION
      </p>

      <p className="mt-2 text-2xl font-black text-cyan-300">
        300–380
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Estimated range
      </p>
    </div>

  </div>

  {/* Verification status */}
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold">
          Verification Progress
        </p>

        <p className="mt-1 text-xs text-slate-500">
          52 of 86 affected households verified
        </p>
      </div>

      <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-bold text-green-300">
        60% VERIFIED
      </span>
    </div>

    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-cyan-400"
        style={{ width: "60%" }}
      />
    </div>

    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">

      <div className="rounded-xl bg-green-400/5 p-3">
        <p className="text-xs text-slate-500">
          VERIFIED
        </p>

        <p className="mt-1 font-bold text-green-300">
          52 households
        </p>
      </div>

      <div className="rounded-xl bg-orange-400/5 p-3">
        <p className="text-xs text-slate-500">
          PENDING
        </p>

        <p className="mt-1 font-bold text-orange-300">
          34 households
        </p>
      </div>

      <div className="rounded-xl bg-white/5 p-3">
        <p className="text-xs text-slate-500">
          STATUS
        </p>

        <p className="mt-1 font-bold">
          Ongoing
        </p>
      </div>

    </div>
  </div>

  {/* Rescue & medical intelligence */}
  <div className="mt-6 grid gap-4 md:grid-cols-2">

    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
      <p className="text-xs font-bold tracking-widest text-red-300">
        RESCUE REQUIREMENT
      </p>

      <p className="mt-2 text-3xl font-black">
        27
      </p>

      <p className="mt-1 text-sm text-slate-400">
        people requiring rescue assistance
      </p>
    </div>

    <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">
      <p className="text-xs font-bold tracking-widest text-purple-300">
        MEDICAL EMERGENCIES
      </p>

      <p className="mt-2 text-3xl font-black">
        5
      </p>

      <p className="mt-1 text-sm text-slate-400">
        medical cases reported by field volunteers
      </p>
    </div>

  </div>

  {/* Important distinction */}
  <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">

    <p className="text-xs font-bold tracking-widest text-yellow-300">
      DATA CONFIDENCE
    </p>

    <p className="mt-2 text-sm leading-6 text-slate-400">
      Population figures are currently estimates based on field
      verification and available regional data. They should not be
      treated as an exact count of trapped people until verified by
      rescue teams or authorities.
    </p>

  </div>

  <div className="mt-6 flex flex-wrap gap-3">

    <button
      type="button"
      onClick={() =>
        alert(
          "Field verification updated successfully.\n\n" +
          "52 households verified.\n" +
          "Estimated affected population: 300–380.\n" +
          "27 rescue requests identified.\n" +
          "5 medical emergencies identified."
        )
      }
      className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition hover:bg-cyan-300"
    >
      Update Verification
    </button>

    <button
      type="button"
      onClick={() =>
        alert(
          "Rescue priority created for Rampur.\n\n" +
          "Priority: Critical\n" +
          "Estimated affected population: 300–380\n" +
          "Rescue requests: 27\n" +
          "Medical emergencies: 5"
        )
      }
      className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10"
    >
      Create Rescue Priority →
    </button>

  </div>
</section>

        {/* MAP + INCIDENTS */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* LIVE MAP */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#081421] lg:col-span-2">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest text-cyan-400">
                  LIVE OVERVIEW
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Incident Priority Map
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                <span className="text-red-400">● Critical</span>
                <span className="text-orange-400">● High</span>
                <span className="text-yellow-400">● Medium</span>
              </div>
            </div>

            <div className="h-[500px] overflow-hidden">
              <DisasterMap />
            </div>
          </section>

          {/* INCIDENT QUEUE */}
          <section className="rounded-3xl border border-white/10 bg-[#081421]">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-red-400">
                    RESPONSE QUEUE
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    Active Incidents
                  </h3>
                </div>

                <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300">
                  {incidents.length} Active
                </span>
              </div>
            </div>

            <div className="max-h-[500px] space-y-3 overflow-y-auto p-4">
              {incidents.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-400">
                  No incidents available yet.
                </p>
              ) : (
                incidents.map((incident) => (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => setSelectedIncident(incident)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{incident.type}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {incident.id} • {getLocationText(incident.location)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-bold ${getSeverityStyle(
                          incident.severity
                        )}`}
                      >
                        {incident.severity || "Unknown"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        👥 {getAffectedPeople(incident)} affected
                      </span>
                      <span className="text-cyan-400">Review →</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        {/* SELECTED INCIDENT */}
        {selectedIncident && (
          <section 
            ref={selectedIncidentRef}
          className="mt-6 rounded-3xl border border-cyan-400/20 bg-[#081421] p-6">
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
  <p className="text-xs font-bold tracking-widest text-slate-500">
    INCIDENT STATUS
  </p>

  <div className="mt-2 flex items-center gap-3">
    <span
      className={`h-3 w-3 rounded-full ${
        selectedIncident.status === "Rescue Dispatched"
          ? "bg-red-400"
          : selectedIncident.status === "Resources Allocated"
            ? "bg-green-400"
            : selectedIncident.status === "Verified"
              ? "bg-cyan-400"
              : "bg-orange-400"
      }`}
    />

    <span className="font-bold">
      {selectedIncident.status || "Pending Verification"}
    </span>
  </div>
</div>

            {/* INCIDENT DETAILS */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-500">AFFECTED PEOPLE</p>
                <p className="mt-2 text-2xl font-black">
                  {getAffectedPeople(selectedIncident)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-500">LOCATION</p>
                <p className="mt-2 font-bold">
                  📍 {getLocationText(selectedIncident.location)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-xs text-slate-500">REQUIRED RESPONSE</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(selectedIncident.needs || []).map((need, index) => (
                    <span
                      key={`${selectedIncident.id}-${index}`}
                      className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
                    >
                      {need}
                    </span>
                  ))}

                  {(!selectedIncident.needs ||
                    selectedIncident.needs.length === 0) && (
                    <span className="text-sm text-slate-400">
                      No specific needs reported
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI INCIDENT INTELLIGENCE */}

<div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
      🧠
    </div>

    <div>
      <p className="text-xs tracking-widest text-cyan-300">
        AI INCIDENT INTELLIGENCE
      </p>

      <p className="text-sm text-slate-400">
        Automated analysis from citizen report
      </p>
    </div>

  </div>

  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        INCIDENT
      </p>

      <p className="mt-1 font-bold">
        {selectedIncident.aiAnalysis?.incident ||
          selectedIncident.type ||
          "Unknown"}
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        SEVERITY
      </p>

      <p className="mt-1 font-bold">
        {selectedIncident.aiAnalysis?.severity ||
          selectedIncident.severity ||
          "Unknown"}
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        AFFECTED
      </p>

      <p className="mt-1 font-bold">
        {selectedIncident.affectedEstimate ||
          selectedIncident.affectedPeople ||
          "Unknown"}
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        AI CONFIDENCE
      </p>

      <p className="mt-1 font-bold text-cyan-300">
        {selectedIncident.aiConfidence
          ? `${selectedIncident.aiConfidence}%`
          : "N/A"}
      </p>
    </div>

  </div>

  <div className="mt-4 rounded-xl border border-yellow-400/10 bg-yellow-400/5 p-4">

    <p className="text-xs font-semibold text-yellow-300">
      ⚠️ Verification Required
    </p>

    <p className="mt-1 text-xs leading-5 text-slate-400">
      AI analysis supports emergency response decisions.
      Final verification and resource deployment remain
      under authorized human responders.
    </p>

  </div>

</div>

            {/* AI RECOMMENDATION */}
            <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                  🤖
                </div>

                <div>
                  <p className="text-xs tracking-widest text-purple-300">
                    AI RESPONSE RECOMMENDATION
                  </p>
                  <p className="text-sm text-slate-400">
                    Decision-support recommendation
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
  <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
    RESOURCE ALLOCATION INPUTS
  </p>

  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">

    <div>
      <p className="text-xs text-slate-500">
        AFFECTED POPULATION
      </p>
      <p className="mt-1 font-bold">
        {estimatedPopulation || "Unknown"}
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-500">
        RESCUE REQUESTS
      </p>
      <p className="mt-1 font-bold">
        {rescueRequestCount || 0}
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-500">
        MEDICAL CASES
      </p>
      <p className="mt-1 font-bold">
        {medicalCaseCount || 0}
      </p>
    </div>

  </div>

  <p className="mt-4 text-xs leading-5 text-slate-500">
    Recommendations are generated from incident severity,
    reported needs and field-verification inputs. Final
    allocation remains under authority control.
  </p>
</div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">🚑 AMBULANCE</p>
                  <p className="mt-1 text-xl font-black">
                    {recommendedAmbulances}
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">🚒 RESCUE TEAM</p>
                  <p className="mt-1 text-xl font-black">
                    {recommendedRescueTeams}
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">🏥 MEDICAL UNIT</p>
                  <p className="mt-1 text-xl font-black">
                    {recommendedMedicalUnits}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">

  <div className="flex items-start gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-lg">
      ✓
    </div>

    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-green-300">
        ALLOCATION DECISION SUPPORT
      </p>

      <h4 className="mt-1 text-lg font-bold">
        Recommended deployment
      </h4>
    </div>

  </div>

  <div className="mt-4 grid gap-3 sm:grid-cols-3">

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        RESCUE
      </p>

      <p className="mt-1 font-bold">
        {recommendedRescueTeams} team
        {recommendedRescueTeams !== 1 ? "s" : ""}
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        AMBULANCE
      </p>

      <p className="mt-1 font-bold">
        {recommendedAmbulances}
      </p>
    </div>

    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-xs text-slate-500">
        MEDICAL
      </p>

      <p className="mt-1 font-bold">
        {recommendedMedicalUnits} unit
        {recommendedMedicalUnits !== 1 ? "s" : ""}
      </p>
    </div>

  </div>

        <button
        type="button"
        onClick={() => {
          if (!selectedIncident) return;

          handleStatusChange(
            selectedIncident.id,
            "Resources Allocated"
          );

          alert(
            "Resource allocation approved successfully.\n\n" +
            `Rescue Teams: ${recommendedRescueTeams}\n` +
            `Ambulances: ${recommendedAmbulances}\n` +
            `Medical Units: ${recommendedMedicalUnits}\n\n` +
            "Rescue mission is now ready for deployment."
          );
                }}
              disabled={
          !selectedIncident ||
          selectedIncident.status !== "Verified" &&
          selectedIncident.status !== "Resources Allocated" &&
          selectedIncident.status !== "Rescue Dispatched"
        }
        className="mt-5 rounded-xl bg-green-400 px-5 py-3 font-bold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selectedIncident?.status === "Resources Allocated"
  ? "✓ Resources Allocated"
  : selectedIncident?.status !== "Verified"
    ? "Verify Incident First"
    : "Approve Recommended Allocation →"}
      </button>

      {selectedIncident?.status === "Resources Allocated" && (
  <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">

    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10 text-lg">
        🚑
      </div>

      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-green-300">
          RESOURCE ALLOCATION CONFIRMED
        </p>

        <h4 className="mt-1 text-lg font-bold">
          Rescue mission ready for deployment
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Authority has approved the AI-assisted resource
          recommendation. Rescue teams and emergency medical
          resources can now be dispatched.
        </p>
      </div>

    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">

      <div className="rounded-xl bg-white/5 p-4">
        <p className="text-xs text-slate-500">
          RESCUE TEAMS
        </p>

        <p className="mt-1 text-xl font-black">
          {recommendedRescueTeams}
        </p>
      </div>

      <div className="rounded-xl bg-white/5 p-4">
        <p className="text-xs text-slate-500">
          AMBULANCES
        </p>

        <p className="mt-1 text-xl font-black">
          {recommendedAmbulances}
        </p>
      </div>

      <div className="rounded-xl bg-white/5 p-4">
        <p className="text-xs text-slate-500">
          MEDICAL UNITS
        </p>

        <p className="mt-1 text-xl font-black">
          {recommendedMedicalUnits}
        </p>
      </div>

    </div>

        <button
      type="button"
      onClick={() => {
        if (!selectedIncident) return;

        handleStatusChange(
          selectedIncident.id,
          "Rescue Dispatched"
        );

          navigate("/rescue-tracking", {
  state: {
    incident: {
      ...selectedIncident,
      status: "Rescue Dispatched",
    },
    rescueTeams: recommendedRescueTeams,
    ambulances: recommendedAmbulances,
    medicalUnits: recommendedMedicalUnits,
  },
});        

        alert(
          "Rescue mission dispatched successfully.\n\n" +
          `Rescue Teams: ${recommendedRescueTeams}\n` +
          `Ambulances: ${recommendedAmbulances}\n` +
          `Medical Units: ${recommendedMedicalUnits}\n\n` +
          "Teams have been assigned to the incident."
        );
      }}
      disabled={
        !selectedIncident ||
        selectedIncident.status === "Rescue Dispatched"
      }
      className="mt-5 rounded-xl bg-red-400 px-5 py-3 font-bold text-black transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {selectedIncident?.status === "Rescue Dispatched"
        ? "✓ Rescue Dispatched"
        : "Dispatch Rescue Mission →"}
    </button>

  </div>
)}

  </div>


              {/* WHY */}
             <div className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">

  <p>
    ✓ {selectedIncident.severity || "Unknown"} severity incident
  </p>

  <p>
    ✓ {selectedIncident.affectedEstimate ||
      selectedIncident.affectedPeople ||
      "Unknown"} people potentially affected
  </p>

  {selectedIncident.needs?.map((need, index) => (
    <p key={index}>
      ✓ {need} requested
    </p>
  ))}

  {selectedIncident.roadBlocked && (
    <p>
      ✓ Road access may be blocked
    </p>
  )}

</div>
{selectedIncident?.affectedEstimate && (
  <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3">
    <p className="text-xs font-bold tracking-widest text-cyan-300">
      FIELD VERIFICATION INPUT
    </p>

    <p className="mt-2 text-sm text-slate-400">
      Field verification indicates approximately{" "}
      <span className="font-bold text-white">
        {selectedIncident.affectedEstimate}
      </span>{" "}
      people may be affected. This estimate is used to
      prioritize resource deployment.
    </p>
  </div>
)}

              <p className="mt-4 text-sm leading-6 text-slate-400">
                The recommendation supports authorized responders by
                combining incident information with operational resource
                factors. Final deployment remains under human authority.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/resource-allocation", {
                      state: { incident: selectedIncident },
                    })
                  }
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-300"
                >
                  Review Allocation →
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIncident(null)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        )}

        {/* VIEW ALL INCIDENTS */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/incidents"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            View All Incidents →
          </Link>
        </div>

        {/* INCOMING EMERGENCY REPORTS */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Incoming Emergency Reports
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Citizen reports awaiting authority review
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
              {
                incidents.filter(
                  (item) => item.status === "Pending Verification"
                ).length
              }{" "}
              Pending
            </span>
          </div>

          {incidents.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-700">
                No emergency reports yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Reports submitted by citizens will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents
  .filter(
    (item) =>
      item.status === "Pending Verification"
  )
  .map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {item.id}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {item.type}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {item.description || "No description provided"}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        📍 {getLocationText(item.location)}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      {item.severity || "Unknown"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Affected people
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {getAffectedPeople(item)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Source</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {item.source || "Citizen Report"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {item.status || "Pending Verification"}
                      </p>
                    </div>
                  </div>

                  {item.needs?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-700">
                        Reported needs
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.needs.map((need, index) => (
                          <span
                            key={`${item.id}-${index}`}
                            className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
<div className="mt-5 flex flex-wrap gap-3">

  <button
    type="button"
    onClick={() => {
      const updated = handleStatusChange(
        item.id,
        "Verified"
      );

      const verifiedIncident = updated.find(
        (incident) => incident.id === item.id
      );

      if (verifiedIncident) {
        setSelectedIncident(verifiedIncident);
      }

      alert(
        `Incident ${item.id} verified successfully.\n\n` +
        "Resource allocation can now proceed."
      );
    }}
    className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
  >
    {item.status === "Verified"
      ? "✓ Verified"
      : "Verify Report"}
  </button>


  <button
    type="button"
    onClick={() =>
      handleStatusChange(
        item.id,
        "Rejected"
      )
    }
    disabled={item.status === "Rejected"}
    className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 disabled:opacity-50"
  >
    Reject
  </button>

</div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">
          <p className="text-sm font-semibold text-yellow-300">
            ⚠️ Decision-support system
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            AI-generated recommendations are intended to assist authorized
            responders. Final resource deployment remains under human
            authority.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthorityDashboard;