import React from "react";
import { Link } from "react-router-dom";
import DisasterMap from "../components/DisasterMap";
import SafeLocationMap from "../components/SafeLocationMap";
import DisasterNewsCard from "../components/DisasterNewsCard";

function Home() {
  const incidents = [
    {
      id: "RQ-001",
      type: "Flood",
      location: "Sector 12",
      severity: "Critical",
      affected: "50+",
      status: "Needs Response",
    },
    {
      id: "RQ-002",
      type: "Landslide",
      location: "Hill Road",
      severity: "High",
      affected: "25+",
      status: "Team Assigned",
    },
    {
      id: "RQ-003",
      type: "Fire",
      location: "Industrial Area",
      severity: "High",
      affected: "15+",
      status: "Monitoring",
    },
  ];

  const news = [
    {
      icon: "🌧️",
      title: "Heavy rainfall warning",
      text: "Heavy rainfall may increase flood risk in vulnerable regions.",
    },
    {
      icon: "🌊",
      title: "Flood-prone areas monitored",
      text: "Authorities are monitoring areas where rising water levels may affect communities.",
    },
    {
      icon: "🚑",
      title: "Emergency teams on standby",
      text: "Response teams remain ready for incidents requiring immediate assistance.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050b12] text-white">

     

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050b12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl">
              🛡️
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">
                ResQ<span className="text-cyan-400">-AI</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Disaster Intelligence
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a
              href="#overview"
              className="transition hover:text-white"
            >
              Overview
            </a>

            <a
              href="#map"
              className="transition hover:text-white"
            >
              Live Map
            </a>

            <a
              href="#news"
              className="transition hover:text-white"
            >
              News
            </a>

            <Link
              to="/incidents"
              className="transition hover:text-white"
            >
              Incidents
            </Link>

            <Link
              to="/resources"
              className="transition hover:text-white"
            >
              Resources
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">

            <Link
              to="/authority-dashboard"
              className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white sm:block"
            >
              Response Centre
            </Link>

            <Link
              to="/report-emergency"
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold shadow-lg shadow-red-500/10 transition hover:bg-red-400"
            >
              Report Emergency
            </Link>

          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main
        id="overview"
        className="mx-auto max-w-7xl px-5 py-8"
      >

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-[#0a1826] via-[#081421] to-[#071018] p-7 md:p-10">

          {/* Background glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">

            {/* Hero content */}
            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                AI-POWERED DISASTER RESPONSE
              </div>

              <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Smarter response.
                <br />

                <span className="text-cyan-400">
                  Faster rescue.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                ResQ-AI converts citizen reports into actionable disaster
                intelligence and helps response teams understand incidents,
                priorities and resource requirements.
              </p>

              {/* Buttons */}
              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  to="/report-emergency"
                  className="rounded-xl bg-red-500 px-6 py-3 font-semibold transition hover:bg-red-400"
                >
                  🚨 Report Emergency
                </Link>

                <a
                  href="#map"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
                >
                  View Live Map
                </a>

              </div>

              {/* Trust message */}
              <div className="mt-7 flex flex-wrap gap-5 text-xs text-slate-500">
                <span>✓ Citizen reporting</span>
                <span>✓ AI incident analysis</span>
                <span>✓ Resource intelligence</span>
                <span>✓ Human approval</span>
              </div>

            </div>

            {/* Response Status Card */}
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur">

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">
                  Response Network
                </p>

                <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>

              <div className="mt-7 space-y-5">

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Active Incidents
                    </span>

                    <span className="font-semibold text-white">
                      24
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[72%] rounded-full bg-cyan-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Response Teams
                    </span>

                    <span className="font-semibold text-white">
                      18
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[84%] rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Resources Available
                    </span>

                    <span className="font-semibold text-white">
                      67
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-white/5">
                    <div className="h-2 w-[63%] rounded-full bg-purple-400" />
                  </div>
                </div>

              </div>

              <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">

                <p className="text-xs uppercase tracking-widest text-cyan-400">
                  System Status
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  AI analysis and response coordination systems are
                  currently operational.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* ================= KPI CARDS ================= */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#081421] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Active Incidents
            </p>

            <p className="mt-3 text-3xl font-bold">
              24
            </p>

            <p className="mt-2 text-xs text-red-400">
              4 critical incidents
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#081421] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              People Affected
            </p>

            <p className="mt-3 text-3xl font-bold">
              1,284
            </p>

            <p className="mt-2 text-xs text-orange-400">
              Across active reports
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#081421] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Response Teams
            </p>

            <p className="mt-3 text-3xl font-bold">
              18
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              Currently available
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#081421] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Resources
            </p>

            <p className="mt-3 text-3xl font-bold">
              67
            </p>

            <p className="mt-2 text-xs text-cyan-400">
              Ready for deployment
            </p>
          </div>

        </section>

         <section className="mt-8">
  <SafeLocationMap />
</section>

        {/* ================= PRIORITY INCIDENTS ================= */}
        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                RESPONSE PRIORITY
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Priority Incidents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Incidents currently requiring monitoring or response.
              </p>
            </div>

            <Link
              to="/incidents"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View all incidents →
            </Link>

          </div>

          <div className="grid gap-4 lg:grid-cols-3">

            {incidents.map((incident) => {

              const severityClass =
                incident.severity === "Critical"
                  ? "text-red-400 bg-red-400/10"
                  : incident.severity === "High"
                  ? "text-orange-400 bg-orange-400/10"
                  : "text-yellow-400 bg-yellow-400/10";

              return (
                <div
                  key={incident.id}
                  className="rounded-2xl border border-white/10 bg-[#081421] p-5 transition hover:-translate-y-1 hover:border-cyan-400/20"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="text-xs text-slate-600">
                        {incident.id}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold">
                        {incident.type}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClass}`}
                    >
                      {incident.severity}
                    </span>

                  </div>

                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Location
                      </span>

                      <span className="text-slate-300">
                        {incident.location}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Affected
                      </span>

                      <span className="text-slate-300">
                        {incident.affected}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Status
                      </span>

                      <span className="text-emerald-400">
                        {incident.status}
                      </span>
                    </div>

                  </div>

                  <Link
                    to="/authority-dashboard"
                    className="mt-5 block rounded-xl border border-white/10 px-4 py-2 text-center text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                  >
                    Review Incident
                  </Link>

                </div>
              );
            })}

          </div>
        </section>

        {/* ================= SEVERE ALERT ================= */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-red-400/20 bg-gradient-to-r from-red-500/10 via-[#081421] to-[#081421]">

          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">

            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-xl">
                ⚠️
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="font-bold">
                    Severe Weather Alert
                  </h2>

                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                    High Risk
                  </span>

                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Heavy rainfall may cause localized flooding in vulnerable
                  areas. Residents should follow instructions issued by
                  local authorities and avoid unsafe routes.
                </p>

              </div>
            </div>

            <Link
              to="/incidents"
              className="whitespace-nowrap rounded-xl border border-red-400/20 px-4 py-2 text-sm text-red-300 hover:bg-red-400/10"
            >
              View Alerts
            </Link>

          </div>

        </section>

        {/* ================= REAL DISASTER MAP ================= */}
        <section
          id="map"
          className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#081421]"
        >

          <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                LIVE INTELLIGENCE
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                India Disaster Map
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor reported incidents and response priorities.
              </p>

            </div>

            <div className="flex flex-wrap gap-4 text-xs">

              <span className="text-red-400">
                ● Critical
              </span>

              <span className="text-orange-400">
                ● High
              </span>

              <span className="text-yellow-400">
                ● Medium
              </span>

            </div>

          </div>

          {/* IMPORTANT:
              DisasterMap.jsx must itself contain the Leaflet/map implementation.
              This container gives it a fixed height so the map can render.
          */}
          <div className="h-[450px] w-full">

            <DisasterMap />

          </div>

        </section>
                {/* ================= NEWS ================= */}
        <DisasterNewsCard />

         <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
              QUICK ACTIONS
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Response Tools
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <Link
              to="/report-emergency"
              className="group rounded-2xl border border-white/10 bg-[#081421] p-6 transition hover:border-red-400/30 hover:bg-red-400/[0.03]"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-xl">
                🚨
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Report Emergency
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Submit an emergency report with description, location,
                image and voice information.
              </p>

              <span className="mt-5 block text-sm text-red-400">
                Submit report →
              </span>

            </Link>

            <Link
              to="/authority-dashboard"
              className="group rounded-2xl border border-white/10 bg-[#081421] p-6 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl">
                🏢
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Response Centre
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review incidents, analyze priorities and coordinate
                response activities.
              </p>

              <span className="mt-5 block text-sm text-cyan-400">
                Open dashboard →
              </span>

            </Link>

            <Link
              to="/resource-allocation"
              className="group rounded-2xl border border-white/10 bg-[#081421] p-6 transition hover:border-purple-400/30 hover:bg-purple-400/[0.03]"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-xl">
                📦
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Resource Allocation
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review recommended deployment of rescue teams,
                ambulances and medical resources.
              </p>

              <span className="mt-5 block text-sm text-purple-400">
                Manage resources →
              </span>

            </Link>

          </div>

        </section>

        {/* ================= AI ASSISTANT ================= */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] to-[#081421] p-6 md:p-8">

          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl">
                  🤖
                </div>

                <div>

                  <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                    RESQ ASSISTANT
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Disaster Response Assistant
                  </h2>

                </div>

              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
                Ask questions about incidents, response priorities,
                available resources or emergency procedures. The assistant
                is designed to support responders with information while
                authorized personnel retain final decision-making.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 hover:border-cyan-400/30"
                >
                  Show critical incidents
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 hover:border-cyan-400/30"
                >
                  Available resources
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300 hover:border-cyan-400/30"
                >
                  Response status
                </button>

              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                  🤖
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    ResQ Assistant
                  </p>

                  <p className="text-xs text-emerald-400">
                    Online
                  </p>
                </div>

              </div>

              <div className="mt-5 rounded-xl bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">
                Hello! I can help you understand current incidents,
                response priorities and available resources.
              </div>

              <div className="mt-3 flex gap-2">

                <input
                  type="text"
                  placeholder="Ask about an incident..."
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />

                <button
                  type="button"
                  className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-cyan-300"
                >
                  →
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#081421] p-6 md:p-8">

          <div className="text-center">

            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              From report to response
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
              ResQ-AI connects citizen reporting, AI analysis and
              response intelligence into one workflow.
            </p>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-4">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl">
                1
              </div>

              <h3 className="mt-4 font-semibold">
                Report
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Citizens submit incident details, location, image,
                voice or text.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-xl">
                2
              </div>

              <h3 className="mt-4 font-semibold">
                Analyze
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                AI extracts incident type, severity and potential
                impact.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/10 text-xl">
                3
              </div>

              <h3 className="mt-4 font-semibold">
                Prioritize
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Response intelligence considers severity, distance,
                population and resource availability.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-xl">
                4
              </div>

              <h3 className="mt-4 font-semibold">
                Respond
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Authorized responders review recommendations and
                coordinate deployment.
              </p>

            </div>

          </div>

        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="mt-8 rounded-3xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 p-7 text-center">

          <h2 className="text-2xl font-bold md:text-3xl">
            Help build a faster disaster response network.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Every accurate report can help responders understand
            situations faster and coordinate resources more effectively.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <Link
              to="/report-emergency"
              className="rounded-xl bg-red-500 px-6 py-3 font-semibold hover:bg-red-400"
            >
              Report Emergency
            </Link>

            <Link
              to="/authority-dashboard"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-semibold hover:bg-white/[0.06]"
            >
              Open Response Centre
            </Link>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 border-t border-white/10 bg-[#040910]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">

          <div>
            © 2026 ResQ-AI · AI Disaster Response & Resource Allocation
          </div>

          <div className="flex gap-5">
            <span>AI-assisted</span>
            <span>Human-approved</span>
            <span>Decision-support</span>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;