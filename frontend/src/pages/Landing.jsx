import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">

      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      <div className="landing-grid"></div>

      <nav className="landing-nav">

        <Link to="/" className="landing-logo">
          <span>✦</span>
          ResQ<span>-AI</span>
        </Link>

        <Link to="/signin" className="landing-signin">
          Sign In
        </Link>

      </nav>

      <main className="landing-content">

        <div className="landing-status">
          <span></span>
          AI DISASTER INTELLIGENCE NETWORK
        </div>

        <h1>
          Know the danger.
          <br />
          <span>Respond faster.</span>
        </h1>

        <p>
          ResQ-AI combines disaster intelligence, real-time
          alerts and AI-powered emergency assistance to help
          communities prepare, respond and recover.
        </p>

        <div className="landing-buttons">

          <Link
            to="/signup"
            className="landing-primary"
          >
            Get Started
            <span>→</span>
          </Link>

          <Link
            to="/signin"
            className="landing-secondary"
          >
            I already have an account
          </Link>

        </div>

        <div className="landing-stats">

          <div>
            <strong>24/7</strong>
            <span>Monitoring</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Analysis</span>
          </div>

          <div>
            <strong>LIVE</strong>
            <span>Alerts</span>
          </div>

        </div>

      </main>

      <div className="landing-radar">

        <div className="radar-ring ring-one"></div>
        <div className="radar-ring ring-two"></div>
        <div className="radar-ring ring-three"></div>

        <div className="radar-center">
          🇮🇳
        </div>

        <div className="radar-point point-one"></div>
        <div className="radar-point point-two"></div>
        <div className="radar-point point-three"></div>

      </div>

    </div>
  );
}

export default Landing;