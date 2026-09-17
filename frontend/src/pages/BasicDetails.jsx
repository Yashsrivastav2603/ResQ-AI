import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BasicDetails() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/verification");
  };

  return (
    <div className="onboarding-page">

      <div className="onboarding-card">

        <div className="progress-label">
          STEP 1 OF 3
        </div>

        <div className="progress-bar">
          <div></div>
        </div>

        <div className="onboarding-heading">

          <span>PERSONAL PROFILE</span>

          <h1>Tell us about yourself</h1>

          <p>
            This information helps ResQ-AI personalize
            disaster alerts and safety information for you.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-two-column">

            <div className="input-group">

              <label>Full Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />

            </div>

            <div className="input-group">

              <label>Age</label>

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                min="1"
                max="120"
                required
              />

            </div>

          </div>

          <div className="input-group">

            <label>City</label>

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Kanpur"
              required
            />

          </div>

          <div className="form-two-column">

            <div className="input-group">

              <label>State</label>

              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select state
                </option>

                <option>Uttar Pradesh</option>
                <option>Assam</option>
                <option>Arunachal Pradesh</option>
                <option>Manipur</option>
                <option>Meghalaya</option>
                <option>Mizoram</option>
                <option>Nagaland</option>
                <option>Tripura</option>
                <option>Odisha</option>
                <option>West Bengal</option>

              </select>

            </div>

            <div className="input-group">

              <label>Postal Code</label>

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="auth-button"
          >
            Continue to Verification →
          </button>

        </form>

      </div>

    </div>
  );
}

export default BasicDetails;