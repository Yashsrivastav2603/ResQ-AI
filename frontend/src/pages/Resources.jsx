import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const resourcesData = [
  {
    id: "AMB-001",
    type: "Ambulance",
    location: "Guwahati",
    capacity: "4 patients",
    status: "Available",
    assignment: "Unassigned",
  },
  {
    id: "AMB-002",
    type: "Ambulance",
    location: "Guwahati",
    capacity: "4 patients",
    status: "Deployed",
    assignment: "RQ-001",
  },
  {
    id: "AMB-003",
    type: "Ambulance",
    location: "Kolkata",
    capacity: "4 patients",
    status: "Available",
    assignment: "Unassigned",
  },
  {
    id: "RST-001",
    type: "Rescue Team",
    location: "Guwahati",
    capacity: "8 members",
    status: "Available",
    assignment: "Unassigned",
  },
  {
    id: "RST-002",
    type: "Rescue Team",
    location: "Dehradun",
    capacity: "8 members",
    status: "Deployed",
    assignment: "RQ-002",
  },
  {
    id: "MED-001",
    type: "Medical Unit",
    location: "Guwahati",
    capacity: "10 patients",
    status: "Available",
    assignment: "Unassigned",
  },
  {
    id: "MED-002",
    type: "Medical Unit",
    location: "Kolkata",
    capacity: "10 patients",
    status: "Standby",
    assignment: "Zone B",
  },
];

const getStatusStyle = (status) => {
  if (status === "Available") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "Deployed") {
    return "border-red-400/30 bg-red-500/10 text-red-300";
  }

  if (status === "Standby") {
    return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
  }

  return "border-white/10 bg-white/5 text-slate-300";
};

const getResourceIcon = (type) => {
  if (type === "Ambulance") return "🚑";
  if (type === "Rescue Team") return "🛟";
  if (type === "Medical Unit") return "⚕";
  return "•";
};

const Resources = () => {
  const [filter, setFilter] = useState("All");

  const filteredResources = useMemo(() => {
    if (filter === "All") {
      return resourcesData;
    }

    return resourcesData.filter(
      (resource) => resource.status === filter
    );
  }, [filter]);

  const available = resourcesData.filter(
    (resource) => resource.status === "Available"
  ).length;

  const deployed = resourcesData.filter(
    (resource) => resource.status === "Deployed"
  ).length;

  const standby = resourcesData.filter(
    (resource) => resource.status === "Standby"
  ).length;

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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/authority-dashboard"
              className="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white sm:px-4"
            >
              Dashboard
            </Link>

            <Link
              to="/incidents"
              className="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white sm:px-4"
            >
              Incidents
            </Link>

            <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-300 md:block">
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
            RESOURCE MANAGEMENT
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Resource Control Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor emergency resources, current assignments and
                operational availability across response zones.
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

        {/* KPI CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Available</p>
              <span className="rounded-xl bg-emerald-400/10 px-3 py-2 text-lg">
                ✓
              </span>
            </div>

            <p className="mt-3 text-4xl font-bold text-emerald-300">
              {available}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Ready for deployment
            </p>
          </div>

          <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Deployed</p>
              <span className="rounded-xl bg-red-400/10 px-3 py-2 text-lg">
                →
              </span>
            </div>

            <p className="mt-3 text-4xl font-bold text-red-300">
              {deployed}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Currently responding
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Standby</p>
              <span className="rounded-xl bg-yellow-400/10 px-3 py-2 text-lg">
                ◷
              </span>
            </div>

            <p className="mt-3 text-4xl font-bold text-yellow-300">
              {standby}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Reserved / monitoring
            </p>
          </div>
        </div>

        {/* RESOURCE TYPES */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {["Ambulance", "Rescue Team", "Medical Unit"].map((type) => {
            const total = resourcesData.filter(
              (resource) => resource.type === type
            ).length;

            const active = resourcesData.filter(
              (resource) =>
                resource.type === type &&
                resource.status === "Available"
            ).length;

            return (
              <div
                key={type}
                className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                    {getResourceIcon(type)}
                  </div>

                  <div>
                    <p className="font-semibold">{type}</p>
                    <p className="text-xs text-slate-500">
                      {total} units registered
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Available now</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-300">
                      {active}
                    </p>
                  </div>

                  <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${Math.max((active / total) * 100, 5)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FILTERS */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Resource Inventory</h2>
            <p className="mt-1 text-sm text-slate-500">
              Live inventory view for the response command center.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Available", "Deployed", "Standby"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  filter === item
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1a2b]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Resource
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Capacity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Assignment
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredResources.map((resource) => (
                  <tr
                    key={resource.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">
                          {getResourceIcon(resource.type)}
                        </div>

                        <span className="font-semibold">
                          {resource.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-300">
                      {resource.type}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-300">
                      {resource.location}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {resource.capacity}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          resource.status
                        )}`}
                      >
                        {resource.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {resource.assignment === "Unassigned" ? (
                        <span className="text-sm text-slate-500">
                          Unassigned
                        </span>
                      ) : (
                        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                          {resource.assignment}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResources.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-semibold">No resources found</p>
              <p className="mt-2 text-sm text-slate-500">
                No resources match the selected status.
              </p>
            </div>
          )}
        </div>

        {/* DECISION SUPPORT */}
        <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
          <p className="text-sm leading-6 text-cyan-100/70">
            <span className="font-semibold text-cyan-200">
              Resource intelligence:
            </span>{" "}
            Availability and assignment information can be combined with
            incident severity, affected population, resource matching and
            distance to generate deployment recommendations.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Resources;