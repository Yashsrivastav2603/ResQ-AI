import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mergeSignupDraft } from "../services/signupDraft";

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

const handleSubmit = (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const strongEnough = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/.test(form.password);
  if (!strongEnough) {
    alert("Password must be 8+ characters with an uppercase letter, a lowercase letter, and a digit.");
    return;
  }

  mergeSignupDraft({ name: form.name, email: form.email, password: form.password });
  navigate("/verification");
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b14] px-6 py-10 text-white">

      <div className="w-full max-w-md">

        <Link to="/" className="mb-8 block text-center text-2xl font-black">
          ResQ<span className="text-cyan-400">-AI</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#081421] p-8 shadow-2xl">

          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-cyan-400">
              CREATE ACCOUNT
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Join ResQ-AI
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create your disaster-response profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="Create password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Confirm Password
              </label>

              <input
                required
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 py-3.5 font-black text-black transition hover:bg-cyan-300"
            >
              Create Account →
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default SignUp;
