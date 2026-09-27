import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const incidents = [
  {
    id: 1,
    city: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lng: 91.7362,
    type: "Flood",
    severity: "Critical",
    affected: "50+",
    needs: ["Rescue", "Medical"],
  },
  {
    id: 2,
    city: "Dehradun",
    state: "Uttarakhand",
    lat: 30.3165,
    lng: 78.0322,
    type: "Landslide",
    severity: "High",
    affected: "25+",
    needs: ["Rescue"],
  },
  {
    id: 3,
    city: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    type: "Heavy Rainfall",
    severity: "High",
    affected: "40+",
    needs: ["Medical", "Shelter"],
  },
  {
    id: 4,
    city: "Bhubaneswar",
    state: "Odisha",
    lat: 20.2961,
    lng: 85.8245,
    type: "Cyclone Warning",
    severity: "Critical",
    affected: "100+",
    needs: ["Evacuation", "Rescue"],
  },
  {
    id: 5,
    city: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    type: "Heavy Rainfall",
    severity: "Safe",
    affected: "0-10",
    needs: ["Monitoring"],
  },
];

function getMarkerColor(severity) {
  if (severity === "Critical") {
    return "#ef4444";
  }

  if (severity === "High") {
    return "#facc15";
  }

  return "#34d399";
}

function DisasterMap() {
  const [selectedIncident, setSelectedIncident] = useState(null);

  <button
  onClick={() =>
    navigate("/resource-allocation", {
      state: {
        incident: {
          id: incident.id,
          type: incident.type,
          severity: incident.severity,
          location: `${incident.city}, ${incident.state}`,
          affected: incident.affected,
          needs: incident.needs,
        },
      },
    })
  }
  className="mt-3 w-full rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-white"
>
  Review Allocation →
</button>

  return (
    <div className="relative h-full min-h-105 w-full overflow-hidden rounded-2xl border border-white/10">

      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full min-h-105 w-full"
      >

        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={[incident.lat, incident.lng]}
            radius={10}
            pathOptions={{
              color: getMarkerColor(incident.severity),
              fillColor: getMarkerColor(incident.severity),
              fillOpacity: 0.85,
              weight: 2,
            }}
            eventHandlers={{
              click: () => {
                setSelectedIncident(incident);
              },
            }}
          >

            <Popup>

              <div className="min-w-55">

                <h3 className="text-lg font-bold">
                  {incident.type}
                </h3>

                <p className="mt-1 text-sm">
                  📍 {incident.city}, {incident.state}
                </p>

                <div className="mt-3 space-y-1 text-sm">

                  <p>
                    <strong>Severity:</strong>{" "}
                    {incident.severity}
                  </p>

                  <p>
                    <strong>Affected:</strong>{" "}
                    {incident.affected}
                  </p>

                  <p>
                    <strong>Needs:</strong>{" "}
                    {incident.needs.join(" + ")}
                  </p>

                  <button
  onClick={() => {
    window.location.href = "/resource-allocation";
  }}
  className="mt-3 w-full rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-white"
>
  Review Allocation →
</button>

                </div>

              </div>

            </Popup>

          </CircleMarker>
        ))}

      </MapContainer>

      {selectedIncident && (
  <div className="absolute bottom-4 right-4 z-[1000] w-[300px] rounded-2xl border border-cyan-400/20 bg-[#07101d]/95 p-5 shadow-2xl backdrop-blur-md">

    <div className="flex items-start justify-between gap-3">

      <div>
        <p className="text-[10px] font-semibold tracking-widest text-cyan-400">
          SELECTED INCIDENT
        </p>

        <h3 className="mt-1 text-xl font-bold text-white">
          {selectedIncident.type}
        </h3>
      </div>

      <button
        onClick={() => setSelectedIncident(null)}
        className="text-slate-500 transition hover:text-white"
      >
        ✕
      </button>

    </div>

    <p className="mt-2 text-sm text-slate-400">
      📍 {selectedIncident.city}, {selectedIncident.state}
    </p>

    <div className="mt-4 grid grid-cols-2 gap-3">

      <div className="rounded-xl border border-white/5 bg-white/5 p-3">
        <p className="text-[10px] text-slate-500">
          SEVERITY
        </p>

        <p
          className={`mt-1 font-bold ${
            selectedIncident.severity === "Critical"
              ? "text-red-400"
              : selectedIncident.severity === "High"
              ? "text-yellow-400"
              : "text-emerald-400"
          }`}
        >
          {selectedIncident.severity}
        </p>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/5 p-3">
        <p className="text-[10px] text-slate-500">
          AFFECTED
        </p>

        <p className="mt-1 font-bold text-white">
          {selectedIncident.affected}
        </p>
      </div>

    </div>

    <div className="mt-4">
      <p className="text-[10px] text-slate-500">
        REQUIRED RESOURCES
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedIncident.needs.map((need) => (
          <span
            key={need}
            className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
          >
            {need}
          </span>
        ))}
      </div>
    </div>

    <button
      onClick={() =>
        navigate("/resource-allocation", {
          state: {
            incident: {
              id: selectedIncident.id,
              type: selectedIncident.type,
              severity: selectedIncident.severity,
              location: `${selectedIncident.city}, ${selectedIncident.state}`,
              affected: selectedIncident.affected,
              needs: selectedIncident.needs,
            },
          },
        })
      }
      className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-[#031018] transition hover:bg-cyan-300"
    >
      Review Allocation →
    </button>

  </div>
)}


      {/* MAP HEADER */}
      <div className="pointer-events-none absolute left-4 top-4 z-1000">

        <div className="rounded-xl border border-white/10 bg-[#07101d]/90 px-4 py-3 shadow-xl backdrop-blur-md">

          <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400">
            LIVE INTELLIGENCE
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            India Disaster Network
          </p>

        </div>

      </div>


      {/* LEGEND */}
      <div className="absolute bottom-4 left-4 z-1000 rounded-xl border border-white/10 bg-[#07101d]/95 px-4 py-3 shadow-xl backdrop-blur-md">

        <p className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500">
          INCIDENT SEVERITY
        </p>

        <div className="flex gap-4 text-xs">

          <span className="flex items-center gap-1.5 text-red-400">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Critical
          </span>

          <span className="flex items-center gap-1.5 text-yellow-300">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            High
          </span>

          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Safe
          </span>

        </div>

      </div>


      {/* INCIDENT COUNT */}
      <div className="absolute right-4 top-4 z-1000 rounded-xl border border-white/10 bg-[#07101d]/95 px-4 py-3 backdrop-blur-md">

        <p className="text-[10px] tracking-widest text-slate-500">
          ACTIVE POINTS
        </p>

        <p className="mt-1 text-xl font-bold text-cyan-400">
          {incidents.length}
        </p>

      </div>

    </div>
  );
}

export default DisasterMap;