import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050b14] text-white">

      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#07101d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl ring-1 ring-cyan-400/30">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold">
                ResQ<span className="text-cyan-400">-AI</span>
              </h1>
              <p className="text-[10px] tracking-[0.3em] text-slate-500">
                DISASTER INTELLIGENCE
              </p>
            </div>
          </Link>

          <Link
            to="/signin"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
          >
            Sign In
          </Link>

        </div>
      </nav>

      {/* HERO */}
      <main className="relative mx-auto max-w-7xl px-6 py-20">

        {/* background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-semibold tracking-widest text-cyan-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              AI DISASTER RESPONSE NETWORK
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Know the danger.
              <br />
              <span className="text-cyan-400">Respond faster.</span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              ResQ-AI combines disaster intelligence, real-time alerts
              and AI-powered emergency assistance to help communities
              prepare, respond and recover.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/signup"
                className="rounded-xl bg-cyan-400 px-7 py-4 font-black text-black shadow-lg shadow-cyan-400/20 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Get Started →
              </Link>

              <Link
                to="/signin"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-semibold transition hover:bg-white/10"
              >
                Already have an account
              </Link>

            </div>

            {/* STATS */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-2xl font-black text-cyan-400">24/7</p>
                <p className="mt-1 text-sm text-slate-500">Monitoring</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-2xl font-black text-purple-400">AI</p>
                <p className="mt-1 text-sm text-slate-500">Analysis</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-2xl font-black text-red-400">LIVE</p>
                <p className="mt-1 text-sm text-slate-500">Alerts</p>
              </div>

            </div>

          </div>

          {/* RADAR */}
          <div className="flex justify-center">

            <div className="relative flex h-[420px] w-[420px] items-center justify-center">

              <div className="absolute h-full w-full rounded-full border border-cyan-400/10" />
              <div className="absolute h-[75%] w-[75%] rounded-full border border-cyan-400/10" />
              <div className="absolute h-[50%] w-[50%] rounded-full border border-cyan-400/20" />
              <div className="absolute h-[25%] w-[25%] rounded-full border border-cyan-400/30" />

              <div className="absolute h-full w-px bg-cyan-400/10" />
              <div className="absolute h-px w-full bg-cyan-400/10" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-4xl">
                🇮🇳
              </div>

              <div className="absolute left-[17%] top-[25%] h-4 w-4 rounded-full bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.8)]" />
              <div className="absolute right-[20%] top-[33%] h-4 w-4 rounded-full bg-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.8)]" />
              <div className="absolute bottom-[20%] left-[30%] h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)]" />

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Landing;