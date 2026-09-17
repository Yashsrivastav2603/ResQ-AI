import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Temporary frontend flow
    navigate("/signin");
  };

  return (
    <div className="auth-page">

      <div className="auth-glow"></div>

      <div className="auth-card">

        <Link to="/" className="auth-logo">
          ✦ ResQ<span>-AI</span>
        </Link>

        <div className="auth-heading">

          <span>WELCOME TO RESQ-AI</span>

          <h1>Create your account</h1>

          <p>
            Join the disaster intelligence network.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

          </div>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />

          </div>

          <div className="input-group">

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

          </div>

          <label className="terms-check">

            <input type="checkbox" required />

            <span>
              I agree to the terms and privacy policy
            </span>

          </label>

          <button
            type="submit"
            className="auth-button"
          >
            Create Account →
          </button>

        </form>

        <div className="auth-footer">

          Already have an account?

          <Link to="/signin">
            Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SignUp;