import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BasicDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/verification");
  };

  return (
    <div className="min-h-screen bg-[#050b14] px-4 py-10 text-white">

      <div className="mx-auto w-full max-w-2xl">

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black">
            ResQ<span className="text-cyan-400">-AI</span>
          </h1>

          <p className="mt-1 text-xs tracking-[0.3em] text-slate-500">
            DISASTER INTELLIGENCE
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-[#081421] p-6 shadow-2xl md:p-9">

          {/* Progress */}
          <div className="mb-8">

            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-cyan-400">
                STEP 1 OF 4
              </span>

              <span className="text-xs text-slate-500">
                Basic details
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/4 rounded-full bg-cyan-400" />
            </div>

          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black md:text-4xl">
              Tell us about yourself
            </h2>

            <p className="mt-2 text-slate-400">
              These details help ResQ-AI personalize disaster alerts
              and emergency assistance.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>

              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Age
              </label>

              <input
                required
                type="number"
                min="1"
                max="120"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter your age"
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* City + Postal */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  City
                </label>

                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Lucknow"
                  className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Postal Code
                </label>

                <input
                  required
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 226001"
                  className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

            </div>

            {/* State */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                State
              </label>

              <select
                required
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#050b14] px-4 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              >
                <option value="" className="bg-[#081421]">
                  Select your state
                </option>

                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Arunachal Pradesh">
                  Arunachal Pradesh
                </option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Tripura">Tripura</option>
                <option value="Odisha">Odisha</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            {/* Info */}
            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
              <div className="flex gap-3">
                <span className="text-xl">🛡️</span>

                <div>
                  <p className="font-semibold text-cyan-300">
                    Why do we need this?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Your area information helps ResQ-AI provide
                    relevant disaster alerts and emergency resources.
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 py-4 font-black text-black transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Continue to Verification →
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default BasicDetails;