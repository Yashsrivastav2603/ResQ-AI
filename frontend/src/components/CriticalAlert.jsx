import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getIncidents } from "../services/demoStore";

const ALERT_SEEN_KEY = "resqai_seen_critical_alerts";

const CriticalAlert = () => {
  const navigate = useNavigate();

  const [alertIncident, setAlertIncident] = useState(null);
  const [visible, setVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioContextRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  // --------------------------------
  // GET SEEN ALERTS
  // --------------------------------

  const getSeenAlerts = () => {
    try {
      const stored =
        localStorage.getItem(ALERT_SEEN_KEY);

      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(
        "Unable to read seen alerts:",
        error
      );

      return [];
    }
  };

  // --------------------------------
  // MARK ALERT AS SEEN
  // --------------------------------

  const markAlertAsSeen = (incidentId) => {
    if (!incidentId) return;

    const seenAlerts = getSeenAlerts();

    if (!seenAlerts.includes(incidentId)) {
      seenAlerts.push(incidentId);

      localStorage.setItem(
        ALERT_SEEN_KEY,
        JSON.stringify(seenAlerts)
      );
    }
  };

  // --------------------------------
  // STOP ALARM
  // --------------------------------

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

  // --------------------------------
  // PLAY ALARM
  // --------------------------------

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
        if (
          context.state === "closed"
        ) {
          return;
        }

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          880,
          context.currentTime
        );

        oscillator.frequency.linearRampToValueAtTime(
          440,
          context.currentTime + 0.35
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
          context.currentTime + 0.4
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start();

        oscillator.stop(
          context.currentTime + 0.45
        );
      };

      beep();

      alarmIntervalRef.current =
        setInterval(beep, 700);

      setSoundEnabled(true);

    } catch (error) {
      console.error(
        "Unable to start emergency alarm:",
        error
      );

      setSoundEnabled(false);
    }
  };

  // --------------------------------
  // FIND NEW CRITICAL INCIDENT
  // --------------------------------

  const checkForCriticalIncident = () => {
    const incidents = getIncidents();

    if (!Array.isArray(incidents)) {
      return;
    }

    const seenAlerts = getSeenAlerts();

    const newCriticalIncident =
      incidents.find((incident) => {

        const isCritical =
          incident.severity === "Critical";

        const isPending =
          incident.status ===
          "Pending Verification";

        const alreadySeen =
          seenAlerts.includes(
            incident.id
          );

        return (
          isCritical &&
          isPending &&
          !alreadySeen
        );
      });

    if (!newCriticalIncident) {
      return;
    }

    setAlertIncident(
      newCriticalIncident
    );

    setVisible(true);

    playAlarm();
  };

  // --------------------------------
  // LISTEN FOR NEW INCIDENTS
  // --------------------------------

  useEffect(() => {

    checkForCriticalIncident();

    const handleIncidentUpdate = () => {
      checkForCriticalIncident();
    };

    window.addEventListener(
      "resqai-incidents-updated",
      handleIncidentUpdate
    );

    return () => {

      window.removeEventListener(
        "resqai-incidents-updated",
        handleIncidentUpdate
      );

      stopAlarm();
    };

  }, []);

  // --------------------------------
  // DISMISS
  // --------------------------------

  const dismissAlert = () => {

    if (alertIncident?.id) {
      markAlertAsSeen(
        alertIncident.id
      );
    }

    setVisible(false);

    stopAlarm();
  };

  // --------------------------------
  // VIEW INCIDENT
  // --------------------------------

  const viewIncident = () => {

    if (alertIncident?.id) {
      markAlertAsSeen(
        alertIncident.id
      );
    }

    setVisible(false);

    stopAlarm();

    navigate(
      "/authority-dashboard"
    );
  };

  // --------------------------------
  // UI
  // --------------------------------

  if (
    !visible ||
    !alertIncident
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md">

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-red-500/40 bg-[#080d16] shadow-2xl shadow-red-500/20">

        {/* HEADER */}

        <div className="flex items-center gap-3 bg-red-600 px-6 py-4 text-white">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
            ⚠️
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.2em]">
              EMERGENCY ALERT
            </p>

            <p className="font-black">
              CRITICAL INCIDENT DETECTED
            </p>
          </div>

        </div>

        {/* CONTENT */}

        <div className="p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-red-400">
                IMMEDIATE ATTENTION REQUIRED
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {alertIncident.type ||
                  "Critical Emergency"}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Incident ID:{" "}
                {alertIncident.id}
              </p>

            </div>

            <div className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-black text-red-300">
              CRITICAL
            </div>

          </div>

          {/* DETAILS */}

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                PEOPLE AFFECTED
              </p>

              <p className="mt-2 text-3xl font-black text-purple-300">
                {alertIncident.affectedPeople ??
                  "Unknown"}
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

              <p className="text-xs text-slate-500">
                LOCATION
              </p>

              <p className="mt-2 text-sm font-bold text-white">
                📍{" "}
                {alertIncident.location?.address ||
                  "GPS location available"}
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">

            <p className="text-xs text-slate-500">
              INCIDENT DESCRIPTION
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {alertIncident.description ||
                "No description provided."}
            </p>

          </div>

          {/* NEEDS */}

          <div className="mt-4">

            <p className="text-xs text-slate-500">
              REQUIRED RESPONSE
            </p>

            <div className="mt-2 flex flex-wrap gap-2">

              {(alertIncident.needs || []).map(
                (need) => (
                  <span
                    key={need}
                    className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300"
                  >
                    {need}
                  </span>
                )
              )}

            </div>

          </div>

          {/* SOUND */}

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3">

            <span className="text-lg">
              {soundEnabled
                ? "🔊"
                : "🔇"}
            </span>

            <p className="text-xs text-yellow-200/80">
              {soundEnabled
                ? "Emergency alarm is active."
                : "Emergency alarm is currently off."}
            </p>

          </div>

          {/* ACTIONS */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">

            {!soundEnabled && (
              <button
                type="button"
                onClick={playAlarm}
                className="flex-1 rounded-xl bg-red-500 px-5 py-3 font-black text-white transition hover:bg-red-400"
              >
                🔊 Enable Alarm
              </button>
            )}

            <button
              type="button"
              onClick={viewIncident}
              className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-black text-black transition hover:bg-cyan-300"
            >
              Open Response Dashboard →
            </button>

            <button
              type="button"
              onClick={dismissAlert}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/10"
            >
              Dismiss
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CriticalAlert;