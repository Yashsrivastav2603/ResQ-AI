import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function ReportEmergency() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [description, setDescription] = useState("");

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [recording, setRecording] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --------------------------------------------------
  // IMAGE UPLOAD
  // --------------------------------------------------

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // --------------------------------------------------
  // LIVE LOCATION
  // --------------------------------------------------

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLocationLoading(false);
      },

      () => {
        setLocationLoading(false);
        alert(
          "Location permission was not provided. You can still submit the report."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // --------------------------------------------------
  // VOICE RECORDING
  // --------------------------------------------------

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(blob);

        setVoiceBlob(blob);
        setVoiceUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
      alert(
        "Microphone permission is required for voice reporting."
      );
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // --------------------------------------------------
  // DEMO AI ANALYSIS
  // --------------------------------------------------

  const analyzeEmergency = async () => {
    if (!description.trim() && !image) {
      alert(
        "Please upload an image or describe the emergency first."
      );
      return;
    }

    setAnalyzing(true);
    setAnalysis(null);

    // Temporary demo delay.
    // Later this will call the real AI backend.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const text = description.toLowerCase();

    let incident = "Disaster Incident";
    let severity = "Medium";
    let affectedPeople = "10-25";
    let needs = ["Monitoring"];

    if (
      text.includes("flood") ||
      text.includes("water") ||
      text.includes("rain")
    ) {
      incident = "Flood";
      severity = "Critical";
      affectedPeople = "50+";
      needs = ["Rescue", "Medical"];
    } else if (
      text.includes("fire") ||
      text.includes("flame") ||
      text.includes("burn")
    ) {
      incident = "Fire";
      severity = "Critical";
      affectedPeople = "25+";
      needs = ["Fire Response", "Medical"];
    } else if (
      text.includes("landslide") ||
      text.includes("land slide")
    ) {
      incident = "Landslide";
      severity = "High";
      affectedPeople = "25+";
      needs = ["Rescue", "Evacuation"];
    } else if (
      text.includes("earthquake") ||
      text.includes("building collapsed") ||
      text.includes("collapse")
    ) {
      incident = "Earthquake";
      severity = "Critical";
      affectedPeople = "50+";
      needs = ["Rescue", "Medical", "Shelter"];
    }

    setAnalysis({
      incident,
      severity,
      affectedPeople,
      needs,
      confidence: 92,
    });

    setAnalyzing(false);
  };

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      if (voiceUrl) {
        URL.revokeObjectURL(voiceUrl);
      }
    };
  }, [imagePreview, voiceUrl]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#050b14] text-white">

      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-[#07101d]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/home" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xl ring-1 ring-cyan-400/30">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold">
                ResQ<span className="text-cyan-400">-AI</span>
              </h1>

              <p className="text-[10px] tracking-[0.25em] text-slate-500">
                DISASTER INTELLIGENCE
              </p>
            </div>

          </Link>

          <Link
            to="/home"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </nav>


      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold tracking-widest text-red-400">

            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

            EMERGENCY RESPONSE

          </div>

          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            Report an emergency
          </h2>

          <p className="mt-4 max-w-2xl text-slate-400">
            Share what is happening. ResQ-AI will analyze the
            incident and help identify the response requirements.
          </p>

        </div>


        {/* CONTENT */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT SIDE */}

          <div className="space-y-6 lg:col-span-2">

            {/* IMAGE */}

            <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

              <div className="mb-5">

                <p className="text-xs font-semibold tracking-widest text-cyan-400">
                  STEP 01
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Upload incident image
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  A photo can help AI understand the disaster.
                </p>

              </div>

              {!imagePreview ? (

                <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-400/[0.03] transition hover:border-cyan-400/60 hover:bg-cyan-400/[0.06]">

                  <div className="text-5xl">
                    📷
                  </div>

                  <p className="mt-4 font-semibold">
                    Upload disaster image
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
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

                  <label className="absolute bottom-4 right-4 cursor-pointer rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:bg-black">

                    Change image

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


            {/* DESCRIPTION */}

            <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

              <p className="text-xs font-semibold tracking-widest text-cyan-400">
                STEP 02
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Describe the situation
              </h3>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={6}
                placeholder="Example: Flood water has entered several houses. Around 50 people may need rescue and medical assistance."
                className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-[#050b14] px-5 py-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
              />

              <div className="mt-3 flex justify-between text-xs text-slate-600">

                <span>
                  Be as specific as possible.
                </span>

                <span>
                  {description.length} characters
                </span>

              </div>

            </section>


            {/* VOICE */}

            <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

              <p className="text-xs font-semibold tracking-widest text-cyan-400">
                STEP 03
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Add a voice message
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Useful when typing is difficult during an emergency.
              </p>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">

                {!recording ? (

                  <button
                    type="button"
                    onClick={startRecording}
                    className="rounded-xl bg-purple-500 px-6 py-3 font-bold transition hover:bg-purple-400"
                  >
                    🎤 Start Recording
                  </button>

                ) : (

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="animate-pulse rounded-xl bg-red-500 px-6 py-3 font-bold transition hover:bg-red-400"
                  >
                    ⏹ Stop Recording
                  </button>

                )}

                {voiceBlob && !recording && (

                  <audio
                    controls
                    src={voiceUrl}
                    className="max-w-full"
                  />

                )}

              </div>

              {recording && (
                <p className="mt-4 text-sm text-red-400">
                  ● Recording in progress...
                </p>
              )}

            </section>


            {/* LOCATION */}

            <section className="rounded-3xl border border-white/10 bg-[#081421] p-6">

              <p className="text-xs font-semibold tracking-widest text-cyan-400">
                STEP 04
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Share your location
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Location helps responders understand where
                assistance is needed.
              </p>

              <div className="mt-5 rounded-2xl border border-white/5 bg-[#050b14] p-5">

                {location ? (

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="font-semibold text-emerald-400">
                        ✓ Location detected
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        Latitude: {location.latitude.toFixed(5)}
                      </p>

                      <p className="text-sm text-slate-400">
                        Longitude: {location.longitude.toFixed(5)}
                      </p>

                      <p className="text-xs text-slate-600">
                        Accuracy: approximately{" "}
                        {Math.round(location.accuracy)}m
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={detectLocation}
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                    >
                      Detect Again
                    </button>

                  </div>

                ) : (

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="font-semibold">
                        📍 Location not shared
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Allow location access for better response.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={locationLoading}
                      className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black transition hover:bg-cyan-400 disabled:opacity-50"
                    >
                      {locationLoading
                        ? "Detecting..."
                        : "Detect Location"}
                    </button>

                  </div>

                )}

              </div>

            </section>


            {/* ANALYZE BUTTON */}

            <button
              type="button"
              onClick={analyzeEmergency}
              disabled={analyzing}
              className="w-full rounded-2xl bg-red-500 px-6 py-5 text-lg font-black shadow-xl shadow-red-500/20 transition hover:-translate-y-1 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {analyzing
                ? "🤖 ANALYZING INCIDENT..."
                : "🚨 ANALYZE EMERGENCY"}

            </button>

          </div>


          {/* RIGHT SIDE */}

          <aside className="space-y-6">

            {/* RESPONSE STATUS */}

            <div className="rounded-3xl border border-red-500/10 bg-[#081421] p-6">

              <p className="text-xs font-semibold tracking-widest text-red-400">
                RESPONSE PIPELINE
              </p>

              <h3 className="mt-2 text-xl font-bold">
                How ResQ-AI works
              </h3>

              <div className="mt-6 space-y-5">

                {[
                  ["📷", "Input", "Image + text + voice"],
                  ["🤖", "AI Analysis", "Understand the incident"],
                  ["📊", "Severity", "Estimate urgency"],
                  ["📍", "Location", "Identify response area"],
                  ["🚑", "Resources", "Recommend assistance"],
                ].map(([icon, title, text]) => (

                  <div
                    key={title}
                    className="flex gap-3"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      {icon}
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

            </div>


            {/* SAFETY */}

            <div className="rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6">

              <div className="text-2xl">
                ⚠️
              </div>

              <h3 className="mt-3 font-bold">
                Emergency safety
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                If you are in immediate danger, contact local
                emergency services first. ResQ-AI is a
                decision-support platform.
              </p>

            </div>


            {/* ANALYSIS RESULT */}

            {analysis && (

              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs tracking-widest text-cyan-400">
                      AI ANALYSIS
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Incident detected
                    </h3>
                  </div>

                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    {analysis.confidence}% confidence
                  </span>

                </div>


                <div className="mt-6 space-y-4">

                  <div className="rounded-2xl bg-white/5 p-4">

                    <p className="text-xs text-slate-500">
                      INCIDENT
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {analysis.incident}
                    </p>

                  </div>


                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-red-500/10 p-4">

                      <p className="text-xs text-slate-500">
                        SEVERITY
                      </p>

                      <p className="mt-1 font-bold text-red-400">
                        {analysis.severity}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-purple-500/10 p-4">

                      <p className="text-xs text-slate-500">
                        AFFECTED
                      </p>

                      <p className="mt-1 font-bold text-purple-300">
                        {analysis.affectedPeople}
                      </p>

                    </div>

                  </div>


                  <div className="rounded-2xl bg-white/5 p-4">

                    <p className="text-xs text-slate-500">
                      REQUIRED
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {analysis.needs.map((need) => (

                        <span
                          key={need}
                          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
                        >
                          {need}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

export default ReportEmergency;