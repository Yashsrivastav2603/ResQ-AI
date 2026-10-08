import React, { useEffect, useRef, useState } from "react";

import SafeLocationMap from "./SafeLocationMap";
import safeLocations from "../data/safeLocations";

const EmergencyResponse = ({ incident }) => {
  const [visible, setVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [recommendedLocation, setRecommendedLocation] =
    useState(null);

  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioContextRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const severity = incident?.severity;


  // -----------------------------------------
  // SEVERITY CHECK
  // -----------------------------------------

  const isEmergency =
    severity === "Medium" ||
    severity === "High" ||
    severity === "Critical";


  // -----------------------------------------
  // STOP ALARM
  // -----------------------------------------

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setSoundEnabled(false);
  };


  // -----------------------------------------
  // ALARM
  // -----------------------------------------

  const playAlarm = async () => {
    try {
      stopAlarm();

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const context = new AudioContext();

      audioContextRef.current = context;

      if (context.state === "suspended") {
        await context.resume();
      }


      const beep = () => {
        if (context.state === "closed") {
          return;
        }

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();


        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          severity === "Critical" ? 880 : 660,
          context.currentTime
        );

        oscillator.frequency.linearRampToValueAtTime(
          440,
          context.currentTime + 0.3
        );


        gain.gain.setValueAtTime(
          0.0001,
          context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.25,
          context.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime + 0.35
        );


        oscillator.connect(gain);

        gain.connect(
          context.destination
        );


        oscillator.start();

        oscillator.stop(
          context.currentTime + 0.4
        );
      };


      beep();

      alarmIntervalRef.current =
        setInterval(
          beep,
          severity === "Critical"
            ? 600
            : 900
        );

      setSoundEnabled(true);

    } catch (error) {
      console.error(
        "Emergency alarm error:",
        error
      );

      setSoundEnabled(false);
    }
  };


  // -----------------------------------------
  // GET USER LOCATION
  // -----------------------------------------

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error(
        "Geolocation is not supported."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(
      (position) => {

        const location = {
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,
        };

        setUserLocation(location);
      },

      (error) => {
        console.error(
          "Unable to get user location:",
          error
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };


  // -----------------------------------------
  // DISTANCE CALCULATION
  // -----------------------------------------

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;


    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

      Math.cos(
        (lat1 * Math.PI) / 180
      ) *
        Math.cos(
          (lat2 * Math.PI) / 180
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );


    return R * c;
  };


  // -----------------------------------------
  // FIND RECOMMENDED SAFE LOCATION
  // -----------------------------------------

  useEffect(() => {

    if (!userLocation) {
      return;
    }


    const scoredLocations =
      safeLocations.map((location) => {

        const distance =
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            location.latitude,
            location.longitude
          );


        const capacityScore =
          location.available /
          Math.max(location.capacity, 1);


        /*
          Lower distance is better.
          Higher available capacity is better.

          This is a DEMO recommendation score.
        */

        const score =
          distance -
          capacityScore * 5;


        return {
          ...location,
          distance,
          score,
        };
      });


    scoredLocations.sort(
      (a, b) =>
        a.score - b.score
    );


    setRecommendedLocation(
      scoredLocations[0] || null
    );

  }, [userLocation]);


  // -----------------------------------------
  // EMERGENCY ACTIVATION
  // -----------------------------------------

  useEffect(() => {

    if (!incident || !isEmergency) {
      setVisible(false);
      stopAlarm();
      return;
    }


    setVisible(true);

    getUserLocation();

    playAlarm();


    return () => {
      stopAlarm();
    };

  }, [
    incident?.id,
    incident?.severity,
  ]);


  if (!visible || !incident) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-[9998] overflow-y-auto bg-black/85 px-4 py-6 backdrop-blur-md">

      <div className="mx-auto w-full max-w-6xl">

        {/* HEADER */}

        <div
          className={`rounded-3xl border p-6 ${
            severity === "Critical"
              ? "border-red-500/40 bg-red-500/10"
              : severity === "High"
                ? "border-orange-500/40 bg-orange-500/10"
                : "border-yellow-500/40 bg-yellow-500/10"
          }`}
        >

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-black tracking-[0.25em] text-red-300">
                EMERGENCY RESPONSE
              </p>

              <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
                ⚠️ {severity} Priority Emergency
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Affected area requires immediate attention.
                Move toward the recommended safe location.
              </p>

            </div>


            <div className="flex items-center gap-3">

              <div className="rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-black text-red-300">
                {soundEnabled
                  ? "🔊 ALARM ACTIVE"
                  : "🔇 ALARM OFF"}
              </div>

            </div>

          </div>

        </div>


        {/* MAP */}

        <div className="mt-5 rounded-3xl border border-white/10 bg-[#081421] p-4 md:p-6">

          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
                LIVE SAFETY MAP
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Find the safest available location
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your location and available emergency
                support locations are shown below.
              </p>

            </div>


            {recommendedLocation && (

              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3">

                <p className="text-xs font-bold text-emerald-400">
                  RECOMMENDED
                </p>

                <p className="mt-1 font-bold text-white">
                  {recommendedLocation.name}
                </p>

              </div>

            )}

          </div>


          <SafeLocationMap
            incident={incident}
            selectedLocation={
              recommendedLocation
            }
            userLocation={userLocation}
          />

        </div>


        {/* RECOMMENDED LOCATION */}

        {recommendedLocation && (

          <div className="mt-5 rounded-3xl border border-emerald-400/30 bg-[#081421] p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="flex gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
                  🛡️
                </div>


                <div>

                  <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                    RECOMMENDED SAFE LOCATION
                  </p>

                  <h3 className="mt-1 text-xl font-black text-white">
                    {recommendedLocation.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {recommendedLocation.type}
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-white/5 px-4 py-3">

                  <p className="text-[10px] text-slate-500">
                    DISTANCE
                  </p>

                  <p className="font-black text-white">
                    {recommendedLocation.distance?.toFixed(
                      2
                    )} km
                  </p>

                </div>


                <div className="rounded-xl bg-emerald-400/5 px-4 py-3">

                  <p className="text-[10px] text-slate-500">
                    AVAILABLE
                  </p>

                  <p className="font-black text-emerald-300">
                    {recommendedLocation.available}
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => {

                  const url =
                    `https://www.google.com/maps/dir/?api=1` +
                    `&destination=${recommendedLocation.latitude},${recommendedLocation.longitude}`;

                  window.open(
                    url,
                    "_blank"
                  );

                }}
                className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-black text-black transition hover:bg-cyan-300"
              >
                🧭 Get Directions
              </button>


              {!soundEnabled && (

                <button
                  type="button"
                  onClick={playAlarm}
                  className="rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 font-bold text-red-300 transition hover:bg-red-400/20"
                >
                  🔊 Enable Alarm
                </button>

              )}

            </div>

          </div>

        )}


        {/* SAFE LOCATIONS */}

        <div className="mt-5 grid gap-4 md:grid-cols-2">

          {safeLocations.map((location) => (

            <div
              key={location.id}
              className="rounded-2xl border border-white/10 bg-[#081421] p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-bold text-white">
                    {location.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {location.type}
                  </p>

                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {location.available} available
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* CLOSE */}

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            stopAlarm();
          }}
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 py-4 font-bold text-slate-300 transition hover:bg-white/10"
        >
          Continue to Dashboard
        </button>

      </div>

    </div>
  );
};

export default EmergencyResponse;