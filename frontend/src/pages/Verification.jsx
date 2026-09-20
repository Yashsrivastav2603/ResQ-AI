import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Verification() {
  const navigate = useNavigate();

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleContinue = () => {
    navigate("/location");
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

        <div className="rounded-3xl border border-white/10 bg-[#081421] p-6 shadow-2xl md:p-9">

          {/* Progress */}
          <div className="mb-8">

            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-cyan-400">
                STEP 2 OF 4
              </span>

              <span className="text-xs text-slate-500">
                Identity verification
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/4 rounded-full bg-cyan-400" />
            </div>

          </div>

          <h2 className="text-3xl font-black">
            Verify your identity
          </h2>

          <p className="mt-2 text-slate-400">
            Complete the verification steps to create your secure
            disaster-response profile.
          </p>

          {/* Aadhaar */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#050b14] p-5">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                  🪪
                </div>

                <div>
                  <h3 className="font-bold">
                    Aadhaar verification
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload an Aadhaar image for verification.
                  </p>
                </div>
              </div>

              <label className="cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-center text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20">

                {aadhaarFile ? "Change Photo" : "Upload Photo"}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setAadhaarFile(e.target.files[0])
                  }
                />

              </label>

            </div>

            {aadhaarFile && (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
                ✓ {aadhaarFile.name}
              </div>
            )}

          </div>

          {/* Face */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-[#050b14] p-5">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-2xl">
                  📷
                </div>

                <div>
                  <h3 className="font-bold">
                    Face verification
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Use your camera for face verification.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                className="rounded-xl border border-purple-400/30 bg-purple-400/10 px-5 py-3 text-sm font-bold text-purple-300 transition hover:bg-purple-400/20"
              >
                {cameraActive ? "Camera Active" : "Open Camera"}
              </button>

            </div>

            {cameraActive && (
              <div className="mt-5 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-purple-400/30 bg-purple-400/5">

                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-purple-400/10 text-4xl">
                  👤
                </div>

                <p className="text-sm text-slate-400">
                  Camera verification will be connected here.
                </p>

              </div>
            )}

          </div>

          {/* Privacy */}
          <div className="mt-5 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-4">

            <div className="flex gap-3">
              <span className="text-xl">🔒</span>

              <p className="text-sm leading-6 text-slate-400">
                Identity information should be handled through
                authorized verification services. Raw Aadhaar or
                biometric information should not be stored directly
                in the hackathon database.
              </p>
            </div>

          </div>

          <button
            onClick={handleContinue}
            className="mt-7 w-full rounded-xl bg-cyan-400 py-4 font-black text-black transition hover:bg-cyan-300"
          >
            Continue to Location →
          </button>

        </div>
      </div>
    </div>
  );
}

export default Verification;