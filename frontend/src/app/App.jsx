import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Verification from "../pages/Verification";
import Landing from "../pages/Landing";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import BasicDetails from "../pages/BasicDetails";
import LocationSetup from "../pages/LocationSetup";
import Home from "../pages/Home";
import ReportEmergency from "../pages/ReportEmergency";

import Incidents from "../pages/Incidents";
import Resources from "../pages/Resources";
function App() {
  return (
    <BrowserRouter>
      <Routes>

  {/* First page */}
  <Route path="/" element={<Landing />} />

  {/* Authentication */}
  <Route path="/signup" element={<SignUp />} />
  <Route path="/signin" element={<SignIn />} />

  {/* User onboarding */}
  <Route path="/basic-details" element={<BasicDetails />} />

  <Route
          path="/verification"
          element={<Verification />}
        />

        <Route
  path="/location"
  element={<LocationSetup />}
/>

  {/* Main application */}
  <Route path="/home" element={<Home />} />

  {/* Emergency */}
  <Route path="/report" element={<ReportEmergency />} />

  {/* Other pages */}
 
  <Route path="/incidents" element={<Incidents />} />
  <Route path="/resources" element={<Resources />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;