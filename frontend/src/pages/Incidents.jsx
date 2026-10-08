import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getIncidents,
} from "../services/demoStore";


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
    location.latitude !== undefined &&
    location.longitude !== undefined
  ) {
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  }

  return "Location unavailable";
};


const getAffectedText = (incident) => {
  if (incident.affectedEstimate) {
    return incident.affectedEstimate;
  }

  if (incident.affectedPeople !== undefined) {
    return String(incident.affectedPeople);
  }

  if (incident.affected !== undefined) {
    return String(incident.affected);
  }

  return "Not estimated";
};


const formatReportedTime = (createdAt) => {
  if (!createdAt) {
    return "Recently";
  }

  const created = new Date(createdAt);

  if (Number.isNaN(created.getTime())) {
    return "Recently";
  }

  const difference =
    Date.now() - created.getTime();

  const minutes = Math.floor(
    difference / 60000
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days} day${days > 1 ? "s" : ""} ago`;
};


const Incidents = () => {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);

  const [filter, setFilter] =
    useState("All");

  const [selectedIncident, setSelectedIncident] =
    useState(null);


  // --------------------------------
  // LOAD INCIDENTS
  // --------------------------------

  const loadIncidents = () => {
    const data = getIncidents();

    setIncidents(data);

    setSelectedIncident((current) => {
      if (!current) {
        return null;
      }

      return (
        data.find(
          (incident) =>
            incident.id === current.id
        ) || null
      );
    });
  };


  useEffect(() => {
    loadIncidents();

    const handleIncidentUpdate = () => {
      loadIncidents();
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
  }, []);


  // --------------------------------
  // FILTER
  // --------------------------------

  const filteredIncidents = useMemo(() => {
    if (filter === "All") {
      return incidents;
    }

    return incidents.filter(
      (incident) =>
        incident.severity === filter
    );
  }, [incidents, filter]);


  // --------------------------------
  // STATISTICS
  // --------------------------------

  const criticalCount = incidents.filter(
  (incident) =>
    String(incident.severity || "").toLowerCase() ===
    "critical"
).length;

 const highCount = incidents.filter(
  (incident) =>
    String(incident.severity || "").toLowerCase() ===
    "high"
).length;

const totalAffected = incidents.reduce(
  (total, incident) => {
    const value =
      incident.affectedPeople ??
      incident.affected ??
      incident.affectedCount ??
      incident.population ??
      0;

    const number = Number(value);

    return (
      total +
      (Number.isFinite(number)
        ? number
        : 0)
    );
  },
  0
);


  // --------------------------------
  // RESOURCE ALLOCATION
  // --------------------------------

  const handleAllocation = (
    incident
  ) => {
    navigate(
      "/resource-allocation",
      {
        state: {
          incident,
        },
      }
    );
  };


  return (
    <div className="min-h-screen bg-[#07111f] text-white">

      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-[#081321]/95">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/authority-dashboard"
            className="text-lg font-bold tracking-wide"
          >
            RESQ
            <span className="text-cyan-400">
              -AI
            </span>
          </Link>


          <div className="flex items-center gap-3">

            <Link
              to="/authority-dashboard"
              className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Dashboard
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


      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-xs font-semibold tracking-[0.25em] text-cyan-400">
            INCIDENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Emergency Incidents
          </h1>

          <p className="mt-4 max-w-3xl text-slate-400">
            Review emergency reports submitted by
            citizens and manage the response workflow.
          </p>

        </div>


        {/* KPI CARDS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border border-white/10 bg-[#0c1a2b] p-6">

            <p className="text-sm text-slate-500">
              Total Incidents
            </p>

            <p className="mt-3 text-4xl font-black">
              {incidents.length}
            </p>

          </div>


          <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-6">

            <p className="text-sm text-slate-500">
              Critical
            </p>

            <p className="mt-3 text-4xl font-black text-red-400">
              {criticalCount}
            </p>

          </div>


          <div className="rounded-3xl border border-orange-400/20 bg-orange-500/5 p-6">

            <p className="text-sm text-slate-500">
              High Priority
            </p>

            <p className="mt-3 text-4xl font-black text-orange-400">
              {highCount}
            </p>

          </div>


          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/5 p-6">

            <p className="text-sm text-slate-500">
              People Affected
            </p>

            <p className="mt-3 text-4xl font-black text-cyan-300">
              {totalAffected}
            </p>

          </div>

        </div>


        {/* FILTERS */}

        <div className="my-8 flex flex-wrap gap-3">

          {[
            "All",
            "Critical",
            "High",
            "Medium",
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                filter === item
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item}
            </button>

          ))}

        </div>


        {/* CONTENT */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


          {/* INCIDENT LIST */}

          <section className="lg:col-span-2">

            <div className="space-y-4">

              {filteredIncidents.map(
                (incident) => (

                  <div
                    key={incident.id}
                    className={`rounded-2xl border bg-[#0c1a2b] p-5 transition ${
                      selectedIncident?.id ===
                      incident.id
                        ? "border-cyan-400/40"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >

                    <div className="flex flex-col justify-between gap-4 md:flex-row">

                      <div>

                        <div className="mb-2 flex flex-wrap items-center gap-2">

                          <span className="font-bold text-white">
                            {incident.id}
                          </span>


                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getSeverityStyle(
                              incident.severity
                            )}`}
                          >
                            {incident.severity}
                          </span>


                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                            {incident.type}
                          </span>


                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                            {incident.status ||
                              "Pending Verification"}
                          </span>

                        </div>


                        <h2 className="text-xl font-semibold">
                          {getLocationText(
                            incident.location
                          )}
                        </h2>


                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {incident.description ||
                            "No description provided."}
                        </p>

                      </div>


                      <div className="shrink-0 text-left md:text-right">

                        <p className="text-xs text-slate-500">
                          Reported
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {formatReportedTime(
                            incident.createdAt
                          )}
                        </p>

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">


                      <div>

                        <p className="text-xs text-slate-500">
                          Affected Population
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {getAffectedText(
                            incident
                          )}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs text-slate-500">
                          Required Help
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {(
                            incident.needs ||
                            []
                          ).map((need) => (

                            <span
                              key={need}
                              className="rounded-lg bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-300"
                            >
                              {need}
                            </span>

                          ))}

                        </div>

                      </div>


                      <div className="flex items-end sm:justify-end">

                        <button
                          onClick={() => {
                            setSelectedIncident(
                              incident
                            );

                            handleAllocation(
                              incident
                            );
                          }}
                          className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
                        >
                          Review Allocation
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}


              {/* EMPTY STATE */}

              {filteredIncidents.length ===
                0 && (

                <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-12 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    📭
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    No incidents found
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Citizen emergency reports will
                    appear here automatically.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* SIDE PANEL */}

          <aside className="lg:sticky lg:top-6 lg:self-start">

            <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">

              <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                INCIDENT INTELLIGENCE
              </p>


              {!selectedIncident ? (

                <div className="mt-8 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    !
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    Select an incident
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select an incident to review
                    its details and continue the
                    response workflow.
                  </p>

                </div>

              ) : (

                <div className="mt-6">

                  <div className="flex items-center justify-between">

                    <span className="font-bold">
                      {selectedIncident.id}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${getSeverityStyle(
                        selectedIncident.severity
                      )}`}
                    >
                      {selectedIncident.severity}
                    </span>

                  </div>


                  <h3 className="mt-5 text-xl font-bold">
                    {selectedIncident.type}
                  </h3>


                  <p className="mt-1 text-sm text-slate-400">
                    {getLocationText(
                      selectedIncident.location
                    )}
                  </p>


                  <div className="mt-6 space-y-4">

                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 font-bold text-cyan-300">
                        {selectedIncident.status ||
                          "Pending Verification"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-slate-500">
                        Estimated affected population
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {getAffectedText(
                          selectedIncident
                        )}
                      </p>

                    </div>


                    <div className="rounded-xl bg-white/5 p-4">

                      <p className="text-xs text-slate-500">
                        Detected requirements
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {(
                          selectedIncident.needs ||
                          []
                        ).map((need) => (

                          <span
                            key={need}
                            className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                          >
                            {need}
                          </span>

                        ))}

                      </div>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      handleAllocation(
                        selectedIncident
                      )
                    }
                    className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Open Resource Allocation →
                  </button>

                </div>

              )}

            </div>

          </aside>

        </div>


        {/* DISCLAIMER */}

        <div className="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">

          <p className="text-sm leading-6 text-yellow-100/70">

            <span className="font-semibold text-yellow-200">
              Decision-support notice:
            </span>{" "}

            Incident intelligence and priority
            information are generated to assist
            authorized responders. Final emergency
            actions remain under human authority.

          </p>

        </div>

      </main>

    </div>
  );
};


export default Incidents;