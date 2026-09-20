import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LocationSetup() {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoading(false);
      },
      () => {
        setLoading(false);
        alert(
          "Location permission was not provided. You can continue manually."
        );
      }
    );
  };

  const continueToHome = () => {
    navigate("/home");
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
                STEP 3 OF 4
              </span>

              <span className="text-xs text-slate-500">
                Location setup
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-cyan-400" />
            </div>

          </div>

          {/* Heading */}
          <h2 className="text-3xl font-black">
            Set your location
          </h2>

          <p className="mt-2 leading-7 text-slate-400">
            Your location helps ResQ-AI show nearby disaster alerts,
            affected areas and relevant emergency information.
          </p>

          {/* Location box */}
          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-7 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10 text-4xl">
              📍
            </div>

            <h3 className="mt-5 text-xl font-bold">
              {location
                ? "Location detected"
                : "Detect your current location"}
            </h3>

            {location ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#050b14] p-4 text-sm text-slate-400">
                <p>
                  Latitude:{" "}
                  <span className="text-cyan-400">
                    {location.latitude.toFixed(4)}
                  </span>
                </p>

                <p className="mt-2">
                  Longitude:{" "}
                  <span className="text-cyan-400">
                    {location.longitude.toFixed(4)}
                  </span>
                </p>
              </div>
            ) : (
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Allow location access so ResQ-AI can provide
                location-aware disaster information.
              </p>
            )}

            <button
              onClick={detectLocation}
              disabled={loading}
              className="mt-6 rounded-xl bg-cyan-400 px-7 py-3.5 font-black text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Detecting..."
                : location
                ? "Detect Again"
                : "Allow Location 📍"}
            </button>

          </div>

          {/* Risk intelligence */}
          <div className="mt-5 rounded-2xl border border-purple-400/10 bg-purple-400/5 p-5">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-xl">
                🛡️
              </div>

              <div>
                <h3 className="font-bold text-purple-300">
                  Area Risk Intelligence
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  ResQ-AI can combine your area with historical
                  and live disaster data to show a local risk
                  indicator.
                </p>
              </div>

            </div>

          </div>

          {/* Privacy */}
          <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/2 p-4">

            <span className="text-lg">🔐</span>

            <p className="text-xs leading-5 text-slate-500">
              Location access is used to provide relevant disaster
              information. The browser will ask for your permission
              before sharing your location.
            </p>

          </div>

          {/* Continue */}
          <button
            onClick={continueToHome}
            className="mt-7 w-full rounded-xl bg-cyan-400 py-4 font-black text-black transition hover:bg-cyan-300"
          >
            Continue to ResQ-AI →
          </button>

        </div>
      </div>
    </div>
  );
}

export default LocationSetup;