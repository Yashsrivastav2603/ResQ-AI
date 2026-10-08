import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  getIncidents,
  updateIncidentStatus,
} from "../services/demoStore";


const STATUS_STEPS = [
  {
    key: "Resources Allocated",
    title: "Resources Allocated",
    description: "Emergency resources have been approved.",
    icon: "📦",
  },
  {
    key: "Rescue Dispatched",
    title: "Rescue Dispatched",
    description: "Response teams have been assigned.",
    icon: "🚑",
  },
  {
    key: "Rescue En Route",
    title: "Rescue En Route",
    description: "Teams are travelling to the incident.",
    icon: "🚨",
  },
  {
    key: "On Scene",
    title: "Teams On Scene",
    description: "Responders have reached the affected area.",
    icon: "📍",
  },
  {
    key: "Rescue Completed",
    title: "Rescue Completed",
    description: "The rescue operation has been completed.",
    icon: "✅",
  },
];


const STATUS_ORDER = [
  "Resources Allocated",
  "Rescue Dispatched",
  "Rescue En Route",
  "On Scene",
  "Rescue Completed",
];


const getSeverityStyle = (severity) => {
  if (severity === "Critical") {
    return "border-red-400/30 bg-red-500/10 text-red-300";
  }

  if (severity === "High") {
    return "border-orange-400/30 bg-orange-500/10 text-orange-300";
  }

  if (severity === "Medium") {
    return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
  }

  return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
};


const getLocationText = (location) => {
  if (!location) {
    return "Location unavailable";
  }

  if (typeof location === "string") {
    return location;
  }

  if (location.address) {
    return location.address;
  }

  if (
    location.latitude !== null &&
    location.latitude !== undefined &&
    location.longitude !== null &&
    location.longitude !== undefined
  ) {
    return `${Number(location.latitude).toFixed(5)}, ${Number(
      location.longitude
    ).toFixed(5)}`;
  }

  return "Location unavailable";
};


const getStatusIndex = (status) => {
  const index = STATUS_ORDER.indexOf(status);

  return index === -1 ? 0 : index;
};


const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const RescueTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // --------------------------------
  // INITIAL INCIDENT
  // --------------------------------

  const initialIncident = useMemo(() => {
    const passedIncident =
      location.state?.incident;

    if (passedIncident) {
      return passedIncident;
    }

    const incidents = getIncidents();

    return (
      incidents.find(
        (incident) =>
          incident.status === "Rescue Dispatched"
      ) ||
      incidents.find(
        (incident) =>
          incident.status === "Resources Allocated"
      ) ||
      incidents[0] ||
      null
    );
  }, [location.state]);


  const [incident, setIncident] =
    useState(initialIncident);


  const [resources, setResources] =
    useState({
      rescueTeams:
        location.state?.rescueTeams || 1,

      ambulances:
        location.state?.ambulances || 0,

      medicalUnits:
        location.state?.medicalUnits || 0,
    });


  // --------------------------------
  // LOAD FRESH INCIDENT
  // --------------------------------

  useEffect(() => {
    if (!incident?.id) {
      return;
    }

    const refreshIncident = () => {
      const incidents = getIncidents();

      const freshIncident =
        incidents.find(
          (item) =>
            item.id === incident.id
        );

      if (freshIncident) {
        setIncident(freshIncident);
      }
    };

    refreshIncident();

    const handleIncidentUpdate = () => {
      refreshIncident();
    };

    window.addEventListener(
      "resqai-incidents-updated",
      handleIncidentUpdate
    );

    window.addEventListener(
      "storage",
      handleIncidentUpdate
    );

    return () => {
      window.removeEventListener(
        "resqai-incidents-updated",
        handleIncidentUpdate
      );

      window.removeEventListener(
        "storage",
        handleIncidentUpdate
      );
    };
  }, [incident?.id]);


  // --------------------------------
  // CURRENT STATUS
  // --------------------------------

  const currentStatus =
    incident?.status ||
    "Rescue Dispatched";


  const currentIndex =
    getStatusIndex(currentStatus);


  const progress =
    Math.round(
      (currentIndex /
        (STATUS_ORDER.length - 1)) *
        100
    );


  // --------------------------------
  // STATUS UPDATE
  // --------------------------------

  const updateStatus = (newStatus) => {
    if (!incident?.id) {
      return;
    }

    const updated =
      updateIncidentStatus(
        incident.id,
        newStatus
      );

    const updatedIncident =
      updated.find(
        (item) =>
          item.id === incident.id
      );

    if (updatedIncident) {
      setIncident(updatedIncident);
    }
  };


  // --------------------------------
  // NEXT STATUS
  // --------------------------------

  const nextStatus =
    STATUS_ORDER[currentIndex + 1];


  const handleNextStatus = () => {
    if (!nextStatus) {
      return;
    }

    updateStatus(nextStatus);
  };


  // --------------------------------
  // NO INCIDENT
  // --------------------------------

  if (!incident) {
    return (
      <div className="min-h-screen bg-[#050b14] text-white">

        <nav className="border-b border-white/10 bg-[#07101d]/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <Link
              to="/authority-dashboard"
              className="text-xl font-bold"
            >
              ResQ
              <span className="text-cyan-400">
                -AI
              </span>
            </Link>

            <Link
              to="/authority-dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
            >
              ← Dashboard
            </Link>

          </div>
        </nav>


        <main className="mx-auto max-w-3xl px-6 py-20 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-3xl">
            🚑
          </div>

          <h1 className="mt-6 text-3xl font-black">
            No Active Rescue Mission
          </h1>

          <p className="mt-3 text-slate-400">
            Dispatch a rescue mission from the
            Authority Dashboard to start tracking.
          </p>

          <Link
            to="/authority-dashboard"
            className="mt-8 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-black"
          >
            Return to Dashboard
          </Link>

        </main>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#050b14] text-white">


      {/* ===================================== */}
      {/* NAVBAR */}
      {/* ===================================== */}

      <nav className="border-b border-white/10 bg-[#07101d]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            to="/authority-dashboard"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl ring-1 ring-cyan-400/30">
              🚑
            </div>

            <div>

              <h1 className="text-xl font-bold">
                ResQ
                <span className="text-cyan-400">
                  -AI
                </span>
              </h1>

              <p className="text-[10px] tracking-[0.25em] text-slate-500">
                RESCUE OPERATIONS
              </p>

            </div>

          </Link>


          <div className="flex items-center gap-3">

            <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-400 sm:block">
              ● TRACKING ACTIVE
            </div>

            <Link
              to="/authority-dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              ← Dashboard
            </Link>

          </div>

        </div>

      </nav>


      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* HEADER */}

        <div className="mb-8">

          <p className="text-xs font-semibold tracking-[0.25em] text-cyan-400">
            RESCUE OPERATIONS
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Rescue Tracking
              </h2>

              <p className="mt-4 max-w-3xl text-slate-400">
                Monitor the progress of the active
                emergency response mission.
              </p>

            </div>


            <div
              className={`rounded-full border px-4 py-2 text-sm font-bold ${getSeverityStyle(
                incident.severity
              )}`}
            >
              {incident.severity || "Unknown"} Priority
            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* INCIDENT SUMMARY */}
        {/* ===================================== */}

        <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

          <div className="flex flex-col justify-between gap-5 md:flex-row">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
                ACTIVE INCIDENT
              </p>

              <h3 className="mt-2 text-2xl font-black">
                {incident.type ||
                  "Emergency Incident"}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {incident.id}
              </p>

            </div>


            <div className="rounded-2xl bg-white/5 px-5 py-4">

              <p className="text-xs text-slate-500">
                CURRENT STATUS
              </p>

              <p className="mt-1 font-bold text-cyan-300">
                {currentStatus}
              </p>

            </div>

          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                LOCATION
              </p>

              <p className="mt-2 font-bold">
                📍 {getLocationText(
                  incident.location
                )}
              </p>

            </div>


            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                PEOPLE AFFECTED
              </p>

              <p className="mt-2 text-2xl font-black text-purple-300">
                {incident.affectedPeople ??
                  incident.affected ??
                  "Unknown"}
              </p>

            </div>


            <div className="rounded-2xl bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                RESPONSE NEEDS
              </p>

              <div className="mt-2 flex flex-wrap gap-2">

                {(incident.needs || []).map(
                  (need, index) => (

                    <span
                      key={`${incident.id}-${index}`}
                      className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
                    >
                      {need}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>

        </section>


        {/* ===================================== */}
        {/* PROGRESS */}
        {/* ===================================== */}

        <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
                MISSION PROGRESS
              </p>

              <h3 className="mt-2 text-2xl font-black">
                {currentStatus}
              </h3>

            </div>


            <div className="text-right">

              <p className="text-3xl font-black text-cyan-300">
                {progress}%
              </p>

              <p className="text-xs text-slate-500">
                Mission progress
              </p>

            </div>

          </div>


          {/* PROGRESS BAR */}

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>


          {/* STATUS TIMELINE */}

          <div className="mt-8 grid gap-4 md:grid-cols-5">

            {STATUS_STEPS.map(
              (step, index) => {

                const stepIndex =
                  STATUS_ORDER.indexOf(
                    step.key
                  );

                const completed =
                  currentIndex >=
                  stepIndex;

                const active =
                  currentStatus ===
                  step.key;

                return (
                  <div
                    key={step.key}
                    className="relative"
                  >

                    <div
                      className={`rounded-2xl border p-4 transition ${
                        active
                          ? "border-cyan-400/40 bg-cyan-400/10"
                          : completed
                            ? "border-green-400/20 bg-green-400/5"
                            : "border-white/10 bg-white/[0.03]"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-2xl">
                          {step.icon}
                        </span>

                        {completed && (
                          <span className="text-green-300">
                            ✓
                          </span>
                        )}

                      </div>


                      <p
                        className={`mt-4 text-sm font-bold ${
                          active
                            ? "text-cyan-300"
                            : completed
                              ? "text-green-300"
                              : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>


                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {step.description}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* ===================================== */}
{/* INCIDENT STATUS HISTORY */}
{/* ===================================== */}

<section className="mt-6 rounded-3xl border border-white/10 bg-[#081421] p-6">

  <div className="flex items-center justify-between">

    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-purple-400">
        INCIDENT HISTORY
      </p>

      <h3 className="mt-2 text-2xl font-black">
        Response Timeline
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Complete history of this incident's status changes.
      </p>
    </div>

    <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-2xl sm:flex">
      🕒
    </div>

  </div>


  <div className="mt-8">

    {incident.statusHistory?.length > 0 ? (

      <div className="relative">

        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-white/10" />

        <div className="space-y-7">

          {[...incident.statusHistory]
            .reverse()
            .map((history, index) => {

              const isLatest = index === 0;

              return (
                <div
                  key={`${history.status}-${history.timestamp}-${index}`}
                  className="relative flex gap-5"
                >

                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      isLatest
                        ? "border-cyan-400/50 bg-cyan-400/20 text-cyan-300"
                        : "border-green-400/30 bg-green-400/10 text-green-300"
                    }`}
                  >
                    {isLatest ? "●" : "✓"}
                  </div>


                  {/* Timeline content */}
                  <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

                      <div>

                        <p
                          className={`font-bold ${
                            isLatest
                              ? "text-cyan-300"
                              : "text-white"
                          }`}
                        >
                          {history.status}
                        </p>

                        {isLatest && (
                          <span className="mt-1 inline-block rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            Current Status
                          </span>
                        )}

                      </div>


                      <span className="text-xs text-slate-500">
                        {formatDateTime(history.timestamp)}
                      </span>

                    </div>


                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {history.note ||
                        `Incident status changed to ${history.status}.`}
                    </p>

                  </div>

                </div>
              );
            })}

        </div>

      </div>

    ) : (

      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">

        <div className="text-3xl">
          🕒
        </div>

        <p className="mt-3 font-bold text-slate-300">
          No status history available
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Status changes will appear here as the rescue operation progresses.
        </p>

      </div>

    )}

  </div>

</section>


        {/* ===================================== */}
        {/* RESPONSE RESOURCES */}
        {/* ===================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">


          <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

            <p className="text-xs font-bold tracking-[0.2em] text-red-300">
              🚒 RESCUE TEAMS
            </p>

            <p className="mt-3 text-4xl font-black">
              {resources.rescueTeams}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Teams assigned to this mission
            </p>

          </section>


          <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

            <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
              🚑 AMBULANCES
            </p>

            <p className="mt-3 text-4xl font-black">
              {resources.ambulances}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Emergency transport units
            </p>

          </section>


          <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

            <p className="text-xs font-bold tracking-[0.2em] text-purple-300">
              🏥 MEDICAL UNITS
            </p>

            <p className="mt-3 text-4xl font-black">
              {resources.medicalUnits}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Medical response units
            </p>

          </section>

        </div>

        {/* ===================================== */}
{/* DISASTER MAP */}
{/* ===================================== */}

<section className="mt-6 rounded-3xl border border-white/10 bg-[#081421] p-6">

  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

    <div>

      <p className="text-xs font-bold tracking-[0.2em] text-red-400">
        LIVE RESPONSE MAP
      </p>

      <h3 className="mt-2 text-2xl font-black">
        Disaster & Safe Locations
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        View the reported disaster location and
        nearby emergency support locations.
      </p>

    </div>

    <div className="flex flex-wrap gap-2">

      <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300">
        🔴 Disaster
      </span>

      <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-300">
        🟢 Safe Location
      </span>

    </div>

  </div>


  <div className="mt-6">

    <SafeLocationMap
      incident={incident}
      selectedLocation={selectedLocation}
    />

  </div>

</section>

        <section className="mt-6">

  <div className="mb-4">

    <p className="text-xs font-bold tracking-[0.2em] text-green-400">
      EMERGENCY SUPPORT
    </p>

    <h3 className="mt-2 text-2xl font-black">
      Nearby Safe Locations
    </h3>

  </div>


  <div className="grid gap-4 md:grid-cols-2">

    {safeLocations.map((location) => {

      const isSelected =
        selectedLocation?.id === location.id;

      return (
        <button
          key={location.id}
          type="button"
          onClick={() =>
            setSelectedLocation(location)
          }
          className={`text-left rounded-2xl border p-5 transition ${
            isSelected
              ? "border-cyan-400/50 bg-cyan-400/10"
              : "border-white/10 bg-[#081421] hover:border-white/20 hover:bg-white/[0.05]"
          }`}
        >

          <div className="flex items-start justify-between gap-4">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-400/10 text-xl">
                {location.type === "Hospital"
                  ? "🏥"
                  : location.type === "Shelter"
                    ? "🏠"
                    : location.type === "Relief Camp"
                      ? "⛺"
                      : "🛡️"}
              </div>

              <div>

                <h4 className="font-bold text-white">
                  {location.name}
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  {location.type}
                </p>

              </div>

            </div>


            {isSelected && (
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-bold text-cyan-300">
                SELECTED
              </span>
            )}

          </div>


          <div className="mt-5 grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-white/5 p-3">

              <p className="text-[10px] text-slate-500">
                CAPACITY
              </p>

              <p className="mt-1 font-bold">
                {location.capacity}
              </p>

            </div>


            <div className="rounded-xl bg-green-400/5 p-3">

              <p className="text-[10px] text-slate-500">
                AVAILABLE
              </p>

              <p className="mt-1 font-bold text-green-300">
                {location.available}
              </p>

            </div>

          </div>


          <div className="mt-4 flex items-center justify-between">

            <span className="text-xs text-slate-500">
              📍 Emergency support point
            </span>

            <span className="text-xs font-bold text-cyan-300">
              Show Route →
            </span>

          </div>

        </button>
      );
    })}

  </div>

</section>


        {/* ===================================== */}
        {/* LOCATION / OPERATIONS */}
        {/* ===================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">


          {/* LOCATION */}

          <div className="rounded-3xl border border-white/10 bg-[#081421] p-6">

            <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
              INCIDENT LOCATION
            </p>

            <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-[#050b14]">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400/10 text-3xl">
                  📍
                </div>

                <p className="mt-4 font-bold">
                  Response Location
                </p>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  {getLocationText(
                    incident.location
                  )}
                </p>

                {incident.location?.latitude != null &&
                  incident.location?.longitude != null && (
                    <p className="mt-3 text-xs text-cyan-400">
                      GPS coordinates captured
                    </p>
                  )}

              </div>

            </div>

          </div>


          {/* OPERATION STATUS */}

          <div className="rounded-3xl border border-white/10 bg-[#081421] p-6">

            <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
              OPERATION CONTROL
            </p>


            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">

                <span className="text-sm text-slate-400">
                  Mission ID
                </span>

                <span className="font-bold">
                  {incident.id}
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">

                <span className="text-sm text-slate-400">
                  Dispatch time
                </span>

                <span className="font-bold">
                  {formatTime(
                    incident.updatedAt ||
                      incident.createdAt
                  )}
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">

                <span className="text-sm text-slate-400">
                  Priority
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${getSeverityStyle(
                    incident.severity
                  )}`}
                >
                  {incident.severity ||
                    "Unknown"}
                </span>

              </div>

            </div>


            {/* NEXT ACTION */}

            {nextStatus ? (

              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

                <p className="text-xs font-bold tracking-[0.15em] text-cyan-300">
                  NEXT OPERATION
                </p>

                <h4 className="mt-2 text-lg font-bold">
                  {nextStatus}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Update the mission when the
                  response team reaches the next
                  operational stage.
                </p>


                <button
                  type="button"
                  onClick={handleNextStatus}
                  className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition hover:bg-cyan-300"
                >
                  Mark as "{nextStatus}" →
                </button>

              </div>

            ) : (

              <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">

                <p className="text-xs font-bold tracking-[0.15em] text-green-300">
                  ✓ MISSION COMPLETE
                </p>

                <h4 className="mt-2 text-lg font-bold">
                  Rescue operation completed
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  The response workflow for this
                  incident has been completed.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* ===================================== */}
        {/* INCIDENT DESCRIPTION */}
        {/* ===================================== */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#081421] p-6">

          <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
            INCIDENT REPORT
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Citizen Report
          </h3>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">
            {incident.description ||
              "No incident description was provided."}
          </p>


          <div className="mt-5 flex flex-wrap gap-2">

            {(incident.needs || []).map(
              (need, index) => (

                <span
                  key={index}
                  className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                >
                  {need}
                </span>

              )
            )}

          </div>

        </section>


        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}

        <div className="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">

          <p className="text-sm font-semibold text-yellow-300">
            ⚠️ Decision-support system
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Rescue tracking information is intended
            to assist authorized responders. Actual
            field operations and emergency decisions
            remain under human authority.
          </p>

        </div>


      </main>

    </div>
  );
};


export default RescueTracking;