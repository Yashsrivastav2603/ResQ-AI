import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ReportEmergency = () => {
  const navigate = useNavigate();

  // ---------------- BASIC FORM STATE ----------------
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [location, setLocation] = useState(null);

  // ---------------- VOICE STATE ----------------
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [voiceSaved, setVoiceSaved] = useState(false);

  // ---------------- AI STATE ----------------
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  // ---------------- IMAGE ----------------

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // ---------------- LOCATION ----------------

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location services are not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        alert(
          "Unable to access your location. Please allow location permission."
        );
      }
    );
  };

  // ---------------- VOICE RECORDING ----------------

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Microphone recording is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      let mimeType = "";

      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      }

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const chunks = [];

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalType = mimeType || "audio/webm";

        const blob = new Blob(chunks, {
          type: finalType,
        });

        const url = URL.createObjectURL(blob);

        setVoiceBlob(blob);
        setVoiceUrl(url);
        setVoiceSaved(false);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());

        setIsRecording(false);
        clearInterval(timerRef.current);

        alert("Something went wrong while recording.");
      };

      recorder.start();

      setIsRecording(true);
      setRecordingTime(0);
      setVoiceBlob(null);
      setVoiceUrl("");
      setVoiceSaved(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((previous) => previous + 1);
      }, 1000);
    } catch (error) {
      console.error("Microphone error:", error);

      alert(
        "Microphone access was denied or is unavailable. Please allow microphone permission and try again."
      );
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const deleteRecording = () => {
    if (voiceUrl) {
      URL.revokeObjectURL(voiceUrl);
    }

    setVoiceBlob(null);
    setVoiceUrl("");
    setVoiceSaved(false);
    setRecordingTime(0);
  };

  const continueWithRecording = () => {
    if (!voiceBlob) return;

    setVoiceSaved(true);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      if (voiceUrl) {
        URL.revokeObjectURL(voiceUrl);
      }
    };
  }, [voiceUrl]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ---------------- AI DEMO ----------------

  const analyzeEmergency = () => {
    if (!description.trim() && !image && !voiceBlob) {
      alert(
        "Please add a description, emergency image, or voice message first."
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    setTimeout(() => {
      const text = description.toLowerCase();

      let result = {
        incident: "Emergency",
        severity: "Medium",
        affected_people: "10–25",
        needs: ["Monitoring"],
        confidence: 86,
      };

      if (
        text.includes("flood") ||
        text.includes("water") ||
        text.includes("rain") ||
        text.includes("flooded")
      ) {
        result = {
          incident: "Flood",
          severity: "Critical",
          affected_people: "50+",
          needs: ["Rescue", "Medical"],
          confidence: 92,
        };
      } else if (
        text.includes("fire") ||
        text.includes("flame") ||
        text.includes("burn")
      ) {
        result = {
          incident: "Fire",
          severity: "Critical",
          affected_people: "25+",
          needs: ["Fire Response", "Medical"],
          confidence: 91,
        };
      } else if (text.includes("landslide")) {
        result = {
          incident: "Landslide",
          severity: "High",
          affected_people: "25+",
          needs: ["Rescue", "Evacuation"],
          confidence: 89,
        };
      } else if (
        text.includes("earthquake") ||
        text.includes("collapsed") ||
        text.includes("building collapse")
      ) {
        result = {
          incident: "Earthquake",
          severity: "Critical",
          affected_people: "50+",
          needs: ["Rescue", "Medical", "Shelter"],
          confidence: 94,
        };
      }

      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSendToAuthority = () => {
    navigate("/authority-dashboard");
  };

  const getSeverityStyle = (severity) => {
    if (severity === "Critical") {
      return "border-red-400/30 bg-red-500/10 text-red-300";
    }

    if (severity === "High") {
      return "border-orange-400/30 bg-orange-500/10 text-orange-300";
    }

    if (severity === "Medium") {
      return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
    }

    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-[#081321]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-lg font-bold tracking-wide"
          >
            RESQ<span className="text-cyan-400">-AI</span>
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </nav>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-red-400">
            EMERGENCY REPORTING
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Report an Emergency
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Share whatever information you have. Text, image, voice and
            location can help create a more complete incident report.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT FORM */}

          <div className="space-y-6 lg:col-span-2">

            {/* DESCRIPTION */}

            <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">
              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                  STEP 01
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Describe the emergency
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us what is happening and who may need help.
                </p>
              </div>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={1000}
                rows={6}
                placeholder="Example: Water is rising near the bridge. Around 50 people are trapped and need rescue and medical help."
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#081321] px-5 py-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
              />

              <div className="mt-3 flex justify-between text-xs text-slate-600">
                <span>Be as specific as possible.</span>
                <span>{description.length}/1000</span>
              </div>
            </section>

            {/* IMAGE */}

            <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">
              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                  STEP 02
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Add an incident image
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a photo showing the situation if it is safe to do so.
                </p>
              </div>

              {!imagePreview ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#081321] px-6 py-12 text-center transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.02]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                    📷
                  </div>

                  <p className="mt-4 font-semibold">
                    Upload emergency image
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Emergency preview"
                    className="max-h-[420px] w-full object-cover"
                  />

                  <label className="absolute bottom-4 right-4 cursor-pointer rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-black/90">
                    Change Image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </section>

            {/* VOICE */}

            <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">

              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                  STEP 03
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Add a voice message
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Useful when typing is difficult during an emergency.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#081321] p-8 text-center">

                {/* MICROPHONE ICON */}

                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl ${
                    isRecording
                      ? "animate-pulse bg-red-500/20"
                      : voiceSaved
                      ? "bg-emerald-400/10"
                      : "bg-cyan-400/10"
                  }`}
                >
                  {isRecording ? "🔴" : voiceSaved ? "✅" : "🎙️"}
                </div>

                {/* TITLE */}

                <p className="mt-4 text-lg font-semibold">
                  {isRecording
                    ? "Recording emergency message..."
                    : voiceSaved
                    ? "Voice message ready"
                    : voiceBlob
                    ? "Recording complete"
                    : "Record a voice message"}
                </p>

                {/* TIMER */}

                <p className="mt-1 text-sm text-slate-500">
                  {isRecording
                    ? formatTime(recordingTime)
                    : voiceSaved
                    ? "Ready to include in emergency report"
                    : voiceBlob
                    ? `Duration: ${formatTime(recordingTime)}`
                    : "Tap the button below to start"}
                </p>

                {/* LIVE RECORDING */}

                {isRecording && (
                  <div className="mt-5 flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

                    <span className="text-xs font-semibold text-red-300">
                      LIVE RECORDING
                    </span>
                  </div>
                )}

                {/* AUDIO PREVIEW */}

                {voiceBlob && !isRecording && (
                  <div className="mt-6 w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-3 text-left text-xs font-semibold text-slate-400">
                      AUDIO PREVIEW
                    </p>

                    <audio
                      controls
                      src={voiceUrl}
                      className="w-full"
                    />
                  </div>
                )}

                {/* START / STOP */}

                {!voiceBlob && (
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`mt-5 rounded-xl px-6 py-3 font-bold transition ${
                      isRecording
                        ? "bg-red-500 text-white hover:bg-red-400"
                        : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    }`}
                  >
                    {isRecording
                      ? "⏹ Stop Recording"
                      : "🎙️ Start Recording"}
                  </button>
                )}

                {/* DELETE + CONTINUE */}

                {voiceBlob && !isRecording && !voiceSaved && (
                  <div className="mt-5 flex w-full max-w-md gap-3">

                    <button
                      type="button"
                      onClick={deleteRecording}
                      className="flex-1 rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      🗑 Delete
                    </button>

                    <button
                      type="button"
                      onClick={continueWithRecording}
                      className="flex-1 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
                    >
                      ✓ Continue
                    </button>

                  </div>
                )}

                {/* SAVED STATE */}

                {voiceSaved && (
                  <div className="mt-5 w-full max-w-md">

                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
                      ✓ Voice message attached to this emergency report.
                    </div>

                    <button
                      type="button"
                      onClick={deleteRecording}
                      className="mt-3 text-xs font-semibold text-slate-500 transition hover:text-red-300"
                    >
                      Remove voice message
                    </button>

                  </div>
                )}

              </div>
            </section>

            {/* LOCATION */}

            <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">

              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                  STEP 04
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Share your location
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Location helps responders understand where assistance may
                  be required.
                </p>
              </div>

              {!location ? (
                <button
                  type="button"
                  onClick={getLocation}
                  className="w-full rounded-2xl border border-dashed border-white/15 bg-[#081321] p-6 text-center transition hover:border-cyan-400/30"
                >
                  <span className="text-3xl">📍</span>

                  <p className="mt-3 font-semibold">
                    Use my current location
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your browser will ask for location permission.
                  </p>
                </button>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-xl">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-emerald-300">
                      Location captured
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {location.latitude.toFixed(5)},{" "}
                      {location.longitude.toFixed(5)}
                    </p>
                  </div>

                </div>
              )}

            </section>

            {/* ANALYZE BUTTON */}

            <button
              type="button"
              onClick={analyzeEmergency}
              disabled={isAnalyzing}
              className={`w-full rounded-2xl py-4 text-lg font-black transition ${
                isAnalyzing
                  ? "cursor-wait bg-cyan-500/40 text-cyan-100"
                  : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              }`}
            >
              {isAnalyzing
                ? "🧠 Analyzing Emergency..."
                : "🧠 Analyze Emergency with AI"}
            </button>

          </div>

          {/* RIGHT SIDE */}

          <aside className="lg:sticky lg:top-6 lg:self-start">

            <div className="space-y-6">

              {/* PIPELINE */}

              <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-6">

                <p className="text-xs font-bold tracking-[0.18em] text-cyan-400">
                  RESPONSE PIPELINE
                </p>

                <div className="mt-6 space-y-4">

                  {[
                    ["01", "Collect", "Report information"],
                    ["02", "Analyze", "AI incident intelligence"],
                    ["03", "Prioritize", "Severity + affected population"],
                    ["04", "Route", "Send to response center"],
                  ].map(([number, title, text]) => (
                    <div
                      key={number}
                      className="flex gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-bold text-cyan-300">
                        {number}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>
              </section>

              {/* AI RESULT */}

              {analysis && (
                <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-cyan-300">
                        AI INCIDENT INTELLIGENCE
                      </p>

                      <h2 className="mt-2 text-xl font-bold">
                        Analysis Complete
                      </h2>
                    </div>

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      {analysis.confidence}%
                    </span>

                  </div>

                  <div className="mt-6 space-y-3">

                    <div className="rounded-xl bg-[#081321] p-4">
                      <p className="text-xs text-slate-500">
                        Incident
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {analysis.incident}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#081321] p-4">
                      <p className="text-xs text-slate-500">
                        Severity
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-bold ${getSeverityStyle(
                          analysis.severity
                        )}`}
                      >
                        {analysis.severity}
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#081321] p-4">
                      <p className="text-xs text-slate-500">
                        Estimated affected population
                      </p>

                      <p className="mt-1 font-bold">
                        {analysis.affected_people}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#081321] p-4">
                      <p className="text-xs text-slate-500">
                        Required response
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {analysis.needs.map((need) => (
                          <span
                            key={need}
                            className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleSendToAuthority}
                    className="mt-6 w-full rounded-xl bg-cyan-500 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    Send to Response Center →
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
                    AI provides incident intelligence. Final response
                    decisions remain with authorized responders.
                  </p>

                </section>
              )}

              {/* SAFETY */}

              <section className="rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5">

                <p className="text-sm font-semibold text-yellow-200">
                  ⚠ Safety first
                </p>

                <p className="mt-2 text-xs leading-5 text-yellow-100/60">
                  Do not put yourself in danger to capture a photo, video or
                  location. Move to a safe place and contact local emergency
                  services when necessary.
                </p>

              </section>

            </div>

          </aside>

        </div>
      </main>
    </div>
  );
};

export default ReportEmergency;