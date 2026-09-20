import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/basic-details");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b14] px-6 text-white">

      <div className="w-full max-w-md">

        <Link to="/" className="mb-8 block text-center text-2xl font-black">
          ResQ<span className="text-cyan-400">-AI</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#081421] p-8 shadow-2xl">

          <p className="text-xs font-bold tracking-widest text-cyan-400">
            WELCOME BACK
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Continue to your disaster intelligence dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 py-3.5 font-black text-black transition hover:bg-cyan-300"
            >
              Sign In →
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to ResQ-AI?{" "}
            <Link to="/signup" className="text-cyan-400 hover:underline">
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default SignIn;