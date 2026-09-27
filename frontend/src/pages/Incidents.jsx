import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const incidentsData = [
  {
    id: "RQ-001",
    type: "Flood",
    severity: "Critical",
    affected: "50+",
    location: "Guwahati, Assam",
    reported: "8 min ago",
    needs: ["Rescue", "Medical"],
    description:
      "Water level is rising near a residential area. Multiple people may require immediate rescue and medical assistance.",
  },
  {
    id: "RQ-002",
    type: "Landslide",
    severity: "High",
    affected: "25+",
    location: "Hill Road, Dehradun",
    reported: "18 min ago",
    needs: ["Rescue", "Evacuation"],
    description:
      "Road access is partially blocked following a landslide. Residents may need evacuation support.",
  },
  {
    id: "RQ-003",
    type: "Fire",
    severity: "High",
    affected: "20+",
    location: "Industrial Area, Kolkata",
    reported: "27 min ago",
    needs: ["Fire Response", "Medical"],
    description:
      "Fire reported in an industrial zone with potential risk to nearby workers and buildings.",
  },
  {
    id: "RQ-004",
    type: "Road Blockage",
    severity: "Medium",
    affected: "10",
    location: "Main Highway, Lucknow",
    reported: "41 min ago",
    needs: ["Monitoring"],
    description:
      "Debris is blocking part of the highway. Traffic monitoring and clearance are required.",
  },
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

const Incidents = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = useMemo(() => {
    if (filter === "All") {
      return incidentsData;
    }

    return incidentsData.filter(
      (incident) => incident.severity === filter
    );
  }, [filter]);

  const criticalCount = incidentsData.filter(
    (incident) => incident.severity === "Critical"
  ).length;

  const highCount = incidentsData.filter(
    (incident) => incident.severity === "High"
  ).length;

  const handleAllocation = (incident) => {
    navigate("/resource-allocation", {
      state: {
        incident,
      },
    });
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
            RESQ<span className="text-cyan-400">-AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/authority-dashboard"
              className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              to="/resources"
              className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Resources
            </Link>

            <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 sm:block">
              ● SYSTEM OPERATIONAL
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-cyan-400">
            INCIDENT MANAGEMENT
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Active Incidents
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor incoming emergency reports, review AI-generated
                incident intelligence and initiate resource allocation.
              </p>
            </div>

            <Link
              to="/authority-dashboard"
              className="w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5">
            <p className="text-sm text-slate-400">Total Incidents</p>
            <p className="mt-2 text-3xl font-bold">{incidentsData.length}</p>
          </div>

          <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-5">
            <p className="text-sm text-slate-400">Critical</p>
            <p className="mt-2 text-3xl font-bold text-red-300">
              {criticalCount}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400/20 bg-orange-500/5 p-5">
            <p className="text-sm text-slate-400">High Priority</p>
            <p className="mt-2 text-3xl font-bold text-orange-300">
              {highCount}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">
            <p className="text-sm text-slate-400">People Affected</p>
            <p className="mt-2 text-3xl font-bold text-cyan-300">105+</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["All", "Critical", "High", "Medium"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
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
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`rounded-2xl border bg-[#0c1a2b] p-5 transition ${
                    selectedIncident?.id === incident.id
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
                      </div>

                      <h2 className="text-xl font-semibold">
                        {incident.location}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {incident.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-left md:text-right">
                      <p className="text-xs text-slate-500">Reported</p>
                      <p className="mt-1 text-sm text-slate-300">
                        {incident.reported}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        Affected Population
                      </p>
                      <p className="mt-1 font-semibold text-white">
                        {incident.affected}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Required Help</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {incident.needs.map((need) => (
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
                          setSelectedIncident(incident);
                          handleAllocation(incident);
                        }}
                        className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
                      >
                        Review Allocation
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredIncidents.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-10 text-center">
                  <p className="text-lg font-semibold">No incidents found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    No incidents match the selected severity filter.
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
                    Select an incident to review its details and allocation
                    workflow.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{selectedIncident.id}</span>

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
                    {selectedIncident.location}
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-slate-500">
                        Estimated affected population
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        {selectedIncident.affected}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-slate-500">
                        Detected requirements
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedIncident.needs.map((need) => (
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
                    onClick={() => handleAllocation(selectedIncident)}
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
            Incident intelligence and priority information are generated to
            assist authorized responders. Final emergency actions remain under
            human authority.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Incidents;