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
    <div className="onboarding-page">

      <div className="onboarding-card">

        <div className="step-label">STEP 3 OF 4</div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "75%" }}
          ></div>
        </div>

        <h1>Set your location</h1>

        <p className="onboarding-subtitle">
          Your location helps ResQ-AI show nearby disaster alerts
          and local risk information.
        </p>

        <div className="location-box">

          <div className="location-icon">
            📍
          </div>

          <h2>
            {location
              ? "Location detected"
              : "Detect your current location"}
          </h2>

          {location ? (
            <p>
              Latitude: {location.latitude.toFixed(4)}
              <br />
              Longitude: {location.longitude.toFixed(4)}
            </p>
          ) : (
            <p>
              We only use your location to provide relevant
              disaster information.
            </p>
          )}

          <button
            className="primary-button"
            onClick={detectLocation}
            disabled={loading}
          >
            {loading
              ? "Detecting..."
              : location
              ? "Detect Again"
              : "Allow Location 📍"}
          </button>

        </div>

        <div className="risk-info">
          <span>🛡️</span>

          <div>
            <strong>Area Risk Intelligence</strong>

            <p>
              Later, ResQ-AI can combine your area with historical
              and live disaster data to show a local risk indicator.
            </p>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={continueToHome}
        >
          Continue to ResQ-AI →
        </button>

      </div>

    </div>
  );
}

export default LocationSetup;