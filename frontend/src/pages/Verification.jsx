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
    <div className="onboarding-page">
      <div className="onboarding-card verification-card">

        <div className="step-label">STEP 2 OF 4</div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "50%" }}
          ></div>
        </div>

        <h1>Verify your identity</h1>

        <p className="onboarding-subtitle">
          This helps us create a secure disaster-response profile for you.
        </p>

        {/* Aadhaar Section */}
        <div className="verification-section">
          <div className="verification-icon">🪪</div>

          <div>
            <h3>Aadhaar verification</h3>
            <p>
              Upload a photo of your Aadhaar card for verification.
            </p>
          </div>

          <label className="upload-button">
            {aadhaarFile ? "Change Photo" : "Upload Photo"}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAadhaarFile(e.target.files[0])}
              hidden
            />
          </label>

          {aadhaarFile && (
            <div className="file-success">
              ✓ {aadhaarFile.name}
            </div>
          )}
        </div>

        {/* Face Verification */}
        <div className="verification-section">
          <div className="verification-icon">📷</div>

          <div>
            <h3>Face verification</h3>
            <p>
              Use your camera for a quick face verification.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setCameraActive(!cameraActive)}
          >
            {cameraActive ? "Camera Active" : "Open Camera"}
          </button>

          {cameraActive && (
            <div className="camera-placeholder">
              <div className="camera-circle">👤</div>
              <p>Camera verification will be connected here.</p>
            </div>
          )}
        </div>

        <div className="privacy-note">
          🔒 Your identity information should be handled through
          authorized verification services and should not be stored
          directly in the hackathon database.
        </div>

        <button
          className="primary-button"
          onClick={handleContinue}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}

export default Verification;