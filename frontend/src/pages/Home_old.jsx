import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-navbar">

        <div className="home-logo">
          <span>◉</span>
          ResQ-AI
        </div>

        

        <div className="home-nav-links">
          <span className="active">Home</span>

          <span
            onClick={() => navigate("/report")}
          >
            Emergencies
          </span>

          <span>Alerts</span>
          <span>Resources</span>
        </div>

        <div className="home-user">
          <span className="notification">🔔</span>
          <div className="user-avatar">
            U
          </div>
        </div>

      </nav>


      {/* HERO */}
      <section className="home-hero">

        <div>

          <div className="safe-pill">
            <span></span>
            AREA STATUS: MONITORING
          </div>

          <h1>
            Disaster intelligence,
            <br />
            <span>when every second matters.</span>
          </h1>

          <p>
            Real-time disaster information, emergency reporting
            and intelligent response assistance — all in one place.
          </p>

          <button
            className="emergency-button"
            onClick={() => navigate("/report")}
          >
            🚨 Report Emergency
          </button>

        </div>

        <div className="hero-stat-card">

          <div className="stat-label">
            YOUR AREA
          </div>

          <div className="stat-location">
            📍 Your Location
          </div>

          <div className="risk-level">
            <span></span>
            Low Risk
          </div>

          <p>
            No critical emergency detected nearby.
          </p>

        </div>

      </section>


      {/* MAIN GRID */}
      <section className="dashboard-grid">

        {/* MAP */}
        <div className="dashboard-card map-card">

          <div className="card-header">

            <div>
              <small>LIVE INTELLIGENCE</small>
              <h2>India Disaster Map</h2>
            </div>

            <div className="map-status">
              ● LIVE
            </div>

          </div>

          <div className="fake-india-map">

            <div className="india-shape">
              INDIA
            </div>

            <div className="map-point red p1"></div>
            <div className="map-point red p2"></div>

            <div className="map-point yellow p3"></div>

            <div className="map-point green p4"></div>
            <div className="map-point green p5"></div>

          </div>

          <div className="map-legend">

            <span>
              <i className="legend-red"></i>
              Critical
            </span>

            <span>
              <i className="legend-yellow"></i>
              Moderate
            </span>

            <span>
              <i className="legend-green"></i>
              Safe
            </span>

          </div>

        </div>


        {/* NEWS */}
        <div className="dashboard-card news-card">

          <div className="card-header">

            <div>
              <small>STAY INFORMED</small>
              <h2>Disaster News</h2>
            </div>

            <span className="news-live">
              LIVE
            </span>

          </div>

          <div className="news-item">
            <div className="news-icon">🌧️</div>

            <div>
              <h3>Heavy rainfall alert</h3>
              <p>
                Authorities monitoring rainfall conditions.
              </p>
              <small>12 min ago</small>
            </div>
          </div>

          <div className="news-item">
            <div className="news-icon">🌊</div>

            <div>
              <h3>Flood preparedness advisory</h3>
              <p>
                Residents in vulnerable areas advised to stay alert.
              </p>
              <small>35 min ago</small>
            </div>
          </div>

          <div className="news-item">
            <div className="news-icon">🌍</div>

            <div>
              <h3>Regional seismic activity</h3>
              <p>
                Monitoring stations continue observation.
              </p>
              <small>1 hr ago</small>
            </div>
          </div>

        </div>

      </section>


      {/* CHAT */}
      <section className="dashboard-card chat-card">

        <div className="chat-heading">

          <div className="ai-avatar">
            ✦
          </div>

          <div>
            <small>AI DISASTER ASSISTANT</small>
            <h2>How can I help you?</h2>
          </div>

          <div className="online-status">
            ● ONLINE
          </div>

        </div>

        <div className="suggestion-row">

          <button>
            What should I do during a flood?
          </button>

          <button>
            How do I prepare an emergency kit?
          </button>

          <button>
            What does this alert mean?
          </button>

        </div>

        <div className="chat-input">

          <input
            placeholder="Ask ResQ-AI anything about disaster management..."
          />

          <button>
            ➤
          </button>

        </div>

      </section>

    </div>
  );
}

export default Home;