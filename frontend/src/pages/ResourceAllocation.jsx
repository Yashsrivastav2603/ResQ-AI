import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResourceAllocation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const incident = location.state?.incident || {
    id: "RQ-001",
    type: "Flood",
    severity: "Critical",
    affected: "50+",
    location: "Guwahati, Assam",
    needs: ["Rescue", "Medical"],
  };

  const [allocation, setAllocation] = useState({
    ambulances: 2,
    rescueTeams: 1,
    medicalUnits: 1,
  });

  const [deploymentStatus, setDeploymentStatus] = useState("Pending");

  const steps = [
    "Pending",
    "Approved",
    "Dispatched",
    "On Scene",
    "Completed",
  ];

  const currentStep = steps.indexOf(deploymentStatus);

  const handleApprove = () => {
    setDeploymentStatus("Approved");
  };

  const handleNextStage = () => {
    const nextStep = currentStep + 1;

    if (nextStep < steps.length) {
      setDeploymentStatus(steps[nextStep]);
    }
  };

  const handleModify = () => {
    setAllocation((previous) => ({
      ...previous,
      ambulances: previous.ambulances === 2 ? 1 : 2,
    }));
  };

  const priorityScore = useMemo(() => {
    if (incident.severity === "Critical") {
      return 92;
    }

    if (incident.severity === "High") {
      return 78;
    }

    if (incident.severity === "Medium") {
      return 61;
    }

    return 40;
  }, [incident.severity]);

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

            <Link
              to="/resources"
              className="rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white sm:px-4"
            >
              Resources
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
            DECISION SUPPORT
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Resource Allocation Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Review AI-generated resource recommendations and authorize
                emergency deployment.
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* INCIDENT HEADER */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-bold">{incident.id}</span>

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

              <h2 className="mt-3 text-2xl font-bold">
                {incident.location}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Emergency resource allocation request
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/5 px-5 py-4">
                <p className="text-xs text-slate-500">Affected</p>
                <p className="mt-1 text-lg font-bold">{incident.affected}</p>
              </div>

              <div className="rounded-xl bg-white/5 px-5 py-4">
                <p className="text-xs text-slate-500">Priority</p>
                <p className="mt-1 text-lg font-bold text-cyan-300">
                  {priorityScore}/100
                </p>
              </div>

              <div className="rounded-xl bg-white/5 px-5 py-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 text-lg font-bold text-yellow-300">
                  {deploymentStatus}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TWO COLUMN */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* PRIORITY */}
            <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                    INCIDENT PRIORITY
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Response Priority Score
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Calculated from severity, affected population and detected
                    emergency needs.
                  </p>
                </div>

                <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-cyan-400/20 bg-cyan-400/5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-300">
                      {priorityScore}
                    </p>
                    <p className="text-[10px] text-slate-500">/ 100</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${priorityScore}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Critical</span>
              </div>
            </section>

            {/* AI RECOMMENDATION */}
            <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-cyan-300">
                    AI RECOMMENDATION
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Recommended Deployment
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Suggested resources based on the current incident
                    intelligence.
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                  AI GENERATED
                </div>
              </div>

              {/* RESOURCE CARDS */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#081321] p-5">
                  <p className="text-3xl">🚑</p>
                  <p className="mt-4 text-sm text-slate-400">Ambulances</p>
                  <p className="mt-1 text-3xl font-bold">
                    {allocation.ambulances}
                  </p>
                  <p className="mt-1 text-xs text-emerald-300">
                    Available
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#081321] p-5">
                  <p className="text-3xl">🛟</p>
                  <p className="mt-4 text-sm text-slate-400">
                    Rescue Teams
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {allocation.rescueTeams}
                  </p>
                  <p className="mt-1 text-xs text-emerald-300">
                    Available
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#081321] p-5">
                  <p className="text-3xl">⚕</p>
                  <p className="mt-4 text-sm text-slate-400">
                    Medical Units
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {allocation.medicalUnits}
                  </p>
                  <p className="mt-1 text-xs text-emerald-300">
                    Available
                  </p>
                </div>
              </div>

              {/* WHY */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#081321] p-5">
                <p className="text-sm font-bold text-white">
                  WHY THIS RECOMMENDATION?
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">Severity</p>
                    <p className="mt-1 font-semibold text-red-300">
                      {incident.severity}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">
                      Affected population
                    </p>
                    <p className="mt-1 font-semibold">
                      {incident.affected}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">
                      Resource match
                    </p>
                    <p className="mt-1 font-semibold text-cyan-300">
                      {incident.needs?.join(" + ")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">
                      Operational factor
                    </p>
                    <p className="mt-1 font-semibold text-emerald-300">
                      Nearby resources available
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleApprove}
                  disabled={deploymentStatus !== "Pending"}
                  className={`flex-1 rounded-xl py-3.5 font-bold transition ${
                    deploymentStatus === "Pending"
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      : "cursor-not-allowed bg-white/10 text-slate-500"
                  }`}
                >
                  {deploymentStatus === "Pending"
                    ? "✓ Approve Deployment"
                    : "Deployment Approved"}
                </button>

                <button
                  onClick={handleModify}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Modify
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">
              <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                DEPLOYMENT TRACKER
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Response Progress
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Track the response from authorization to completion.
              </p>

              {/* TRACKER */}
              <div className="mt-8">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div key={step} className="relative flex gap-4">
                      {index !== steps.length - 1 && (
                        <div
                          className={`absolute left-[15px] top-8 h-12 w-px ${
                            index < currentStep
                              ? "bg-cyan-400"
                              : "bg-white/10"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          isCompleted
                            ? "border-cyan-400 bg-cyan-400 text-slate-950"
                            : isCurrent
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-white/10 bg-white/5 text-slate-500"
                        }`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>

                      <div className="pb-8">
                        <p
                          className={`font-semibold ${
                            isCurrent || isCompleted
                              ? "text-white"
                              : "text-slate-500"
                          }`}
                        >
                          {step}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {isCurrent
                            ? "Current stage"
                            : isCompleted
                            ? "Completed"
                            : "Waiting"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NEXT BUTTON */}
              {deploymentStatus !== "Completed" && (
                <button
                  onClick={handleNextStage}
                  disabled={deploymentStatus === "Pending"}
                  className={`w-full rounded-xl py-3 font-bold transition ${
                    deploymentStatus !== "Pending"
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      : "cursor-not-allowed bg-white/5 text-slate-600"
                  }`}
                >
                  {deploymentStatus === "Pending"
                    ? "Approve deployment first"
                    : `Move to ${steps[currentStep + 1]} →`}
                </button>
              )}

              {deploymentStatus === "Completed" && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center">
                  <p className="text-sm font-bold text-emerald-300">
                    ✓ RESPONSE COMPLETED
                  </p>

                  <p className="mt-1 text-xs text-emerald-200/60">
                    Deployment workflow has reached its final stage.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>

        {/* SAFETY NOTE */}
        <section className="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">
          <p className="text-sm leading-6 text-yellow-100/70">
            <span className="font-semibold text-yellow-200">
              Human-in-the-loop:
            </span>{" "}
            ResQ-AI generates a decision-support recommendation. The
            authorized responder reviews and approves the allocation before
            deployment.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ResourceAllocation;