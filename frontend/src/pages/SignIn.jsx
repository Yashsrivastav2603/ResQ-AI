import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend login
    navigate("/basic-details");
  };

  return (
    <div className="auth-page">

      <div className="auth-glow"></div>

      <div className="auth-card">

        <Link to="/" className="auth-logo">
          ✦ ResQ<span>-AI</span>
        </Link>

        <div className="auth-heading">

          <span>WELCOME BACK</span>

          <h1>Sign in to ResQ-AI</h1>

          <p>
            Access your disaster intelligence dashboard.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

          </div>

          <div className="forgot-password">
            Forgot password?
          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Sign In →
          </button>

        </form>

        <div className="auth-footer">

          Don't have an account?

          <Link to="/signup">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SignIn;