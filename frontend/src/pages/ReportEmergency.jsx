import React, { useState } from "react";

function ReportEmergency() {
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 76px)",
        padding: "50px 5%",
      }}
    >

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(13, 24, 40, 0.8)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "35px",
        }}
      >

        <div
          style={{
            color: "#f87171",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "1.5px",
          }}
        >
          EMERGENCY RESPONSE
        </div>

        <h1
          style={{
            marginTop: "10px",
            fontSize: "32px",
          }}
        >
          Report an Emergency
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#94a3b8",
            lineHeight: "1.6",
          }}
        >
          Provide the situation details so ResQ-AI can analyze
          the incident and assist responders.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "30px",
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#cbd5e1",
              fontSize: "13px",
            }}
          >
            What happened?
          </label>

          <select
            style={{
              width: "100%",
              padding: "14px",
              background: "#0b1626",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <option>Flood</option>
            <option>Fire</option>
            <option>Earthquake</option>
            <option>Cyclone</option>
            <option>Landslide</option>
            <option>Other</option>
          </select>

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#cbd5e1",
              fontSize: "13px",
            }}
          >
            Describe the situation
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is happening..."
            rows="6"
            style={{
              width: "100%",
              padding: "14px",
              background: "#0b1626",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              resize: "vertical",
              outline: "none",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "20px",
            }}
          >

            <button
              type="button"
              style={{
                padding: "18px",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.03)",
                color: "#cbd5e1",
              }}
            >
              📷 Upload Image
            </button>

            <button
              type="button"
              style={{
                padding: "18px",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.03)",
                color: "#cbd5e1",
              }}
            >
              🎙 Record Voice
            </button>

          </div>

          <button
            type="button"
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid rgba(59,130,246,0.3)",
              background: "rgba(59,130,246,0.08)",
              color: "#93c5fd",
            }}
          >
            📍 Use Current Location
          </button>

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              background: "#ef4444",
              color: "white",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            🚨 SUBMIT EMERGENCY
          </button>

        </form>

        {submitted && (
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "12px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#86efac",
            }}
          >
            ✓ Emergency report submitted in demo mode.
          </div>
        )}

      </div>

    </div>
  );
}

export default ReportEmergency;