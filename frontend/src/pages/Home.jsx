import React from "react";
import { Link } from "react-router-dom";
import DisasterMap from "../components/DisasterMap";
import DisasterNewsCard from "../components/DisasterNewsCard";

function Home() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">

      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#07101d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl ring-1 ring-cyan-400/30">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                ResQ<span className="text-cyan-400">-AI</span>
              </h1>
              <p className="text-[10px] tracking-[0.25em] text-slate-500">
                DISASTER INTELLIGENCE
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/home"
              className="text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              Home
            </Link>

            <Link
              to="/report"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Emergency
            </Link>

            
              href="#news"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              News
            </a>

            
              href="#assistant"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              AI Assistant
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">SYSTEM STATUS</p>
              <p className="text-xs font-semibold text-emerald-400">
                ● OPERATIONAL
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
              👤
            </div>
          </div>

        </div>
      </nav>


      {/* HERO */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-linear-to-br from-[#0b1b2d] via-[#081421] to-[#050b14] p-8 md:p-12">

          {/* Background glow */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* LEFT */}
            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium tracking-widest text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                AI DISASTER RESPONSE NETWORK
              </div>

              <h2 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                Know the danger.
                <br />
                <span className="text-cyan-400">
                  Respond faster.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
                ResQ-AI combines disaster intelligence, location data and
                AI-powered incident analysis to help communities and
                authorities respond faster.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  to="/report"
                  className="group rounded-xl bg-red-500 px-6 py-4 font-bold shadow-lg shadow-red-500/20 transition hover:-translate-y-1 hover:bg-red-400"
                >
                  🚨 REPORT EMERGENCY
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                
                  href="#map"
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  View Live Map
                </a>

              </div>

              {/* Stats */}
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="text-2xl font-bold text-cyan-400">24/7</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Monitoring
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="text-2xl font-bold text-purple-400">AI</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Analysis
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="text-2xl font-bold text-red-400">LIVE</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Alerts
                  </p>
                </div>

              </div>
            </div>


            {/* RADAR */}
            <div className="flex justify-center">

              <div className="relative flex h-80 w-[320px] items-center justify-center">

                <div className="absolute h-full w-full animate-pulse rounded-full border border-cyan-400/10" />
                <div className="absolute h-[75%] w-[75%] rounded-full border border-cyan-400/15" />
                <div className="absolute h-[50%] w-[50%] rounded-full border border-cyan-400/20" />

                <div className="absolute h-px w-full bg-cyan-400/10" />
                <div className="absolute h-full w-px bg-cyan-400/10" />

                <div className="z-10 flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/5 text-6xl shadow-2xl shadow-cyan-500/20">
                  🇮🇳
                </div>

                {/* Points */}
                <div className="absolute left-[18%] top-[27%] h-4 w-4 animate-ping rounded-full bg-red-500" />
                <div className="absolute left-[18%] top-[27%] h-3 w-3 rounded-full bg-red-500" />

                <div className="absolute right-[20%] top-[35%] h-4 w-4 animate-ping rounded-full bg-yellow-400" />
                <div className="absolute right-[20%] top-[35%] h-3 w-3 rounded-full bg-yellow-400" />

                <div className="absolute bottom-[22%] left-[35%] h-4 w-4 animate-ping rounded-full bg-emerald-400" />
                <div className="absolute bottom-[22%] left-[35%] h-3 w-3 rounded-full bg-emerald-400" />

              </div>

            </div>

          </div>
        </section>


        {/* RISK + MAP */}
        <section
          id="map"
          className="mt-8 grid gap-6 lg:grid-cols-3"
        >

          {/* RISK CARD */}
          <div className="rounded-3xl border border-yellow-400/10 bg-[#081421] p-6">

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-300">
                AREA RISK
              </p>

              <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
                LIVE
              </span>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 text-3xl">
                  🟡
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    Moderate
                  </h3>
                  <p className="text-sm text-slate-500">
                    Current area risk
                  </p>
                </div>

              </div>

              <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[58%] rounded-full bg-yellow-400" />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Risk information will be calculated using historical
                and live disaster data.
              </p>
            </div>

          </div>


          {/* MAP PLACEHOLDER */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#081421] p-6 lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  LIVE INTELLIGENCE
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  India Disaster Map
                </h3>
              </div>

              <div className="flex gap-3 text-xs">
                <span className="text-red-400">● Critical</span>
                <span className="text-yellow-400">● High</span>
                <span className="text-emerald-400">● Safe</span>
              </div>

              

            </div>

            <div className="mt-6 h-105">
  <DisasterMap />
</div>

          </div>

        </section>


        {/* NEWS + CHAT */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          <DisasterNewsCard />


          {/* CHAT */}
          <div
            id="assistant"
            className="rounded-3xl border border-purple-400/10 bg-[#081421] p-6"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-2xl">
                🤖
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  RESQ-AI ASSISTANT
                </p>

                <h3 className="text-2xl font-bold">
                  Disaster Assistant
                </h3>
              </div>

            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-white/3 p-5">

              <p className="text-sm leading-6 text-slate-400">
                Ask about disaster preparedness, emergency procedures,
                evacuation planning or what to do during a disaster.
              </p>

            </div>

            <div className="mt-4 flex gap-3">

              <input
                type="text"
                placeholder="Ask ResQ-AI..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-400/50"
              />

              <button className="rounded-xl bg-purple-500 px-5 font-bold transition hover:bg-purple-400">
                →
              </button>

            </div>

          </div>

        </section>


        {/* EMERGENCY BANNER */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-red-500/20 bg-linear-to-r from-red-500/10 to-orange-500/5 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
                🚨
              </div>

              <div>
                <h3 className="font-bold">
                  Facing an emergency?
                </h3>

                <p className="text-sm text-slate-500">
                  Report your situation and help emergency responders
                  understand what is happening.
                </p>
              </div>

            </div>

            <Link
              to="/report"
              className="rounded-xl bg-red-500 px-6 py-3 text-center font-bold transition hover:bg-red-400"
            >
              Report Emergency →
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;
