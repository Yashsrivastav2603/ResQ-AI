import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// -----------------------------------------
// MAP ICONS
// -----------------------------------------

const userIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:34px;
      height:34px;
      border-radius:50%;
      background:#22d3ee;
      border:4px solid white;
      box-shadow:0 0 20px rgba(34,211,238,.8);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:16px;
    ">
      👤
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const disasterIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:38px;
      height:38px;
      border-radius:50%;
      background:#ef4444;
      border:4px solid white;
      box-shadow:0 0 25px rgba(239,68,68,.9);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:18px;
    ">
      ⚠️
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const shelterIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:36px;
      height:36px;
      border-radius:50%;
      background:#22c55e;
      border:4px solid white;
      box-shadow:0 0 20px rgba(34,197,94,.8);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:17px;
    ">
      🏠
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});


// -----------------------------------------
// SAFE LOCATIONS
// -----------------------------------------

const SAFE_LOCATIONS = [
  {
    id: "shelter-1",
    name: "Emergency Shelter",
    type: "Shelter",
    latitude: 26.7815,
    longitude: 82.7165,
    capacity: 180,
    available: 180,
  },

  {
    id: "hospital-1",
    name: "District Emergency Hospital",
    type: "Hospital",
    latitude: 26.7865,
    longitude: 82.722,
    capacity: 100,
    available: 65,
  },

  {
    id: "shelter-2",
    name: "Community Relief Center",
    type: "Shelter",
    latitude: 26.7755,
    longitude: 82.708,
    capacity: 120,
    available: 90,
  },
];


// -----------------------------------------
// COMPONENT
// -----------------------------------------

const SafeLocationMap = ({
  incident = null,
}) => {

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationError, setLocationError] =
    useState("");

  const [selectedLocation, setSelectedLocation] =
    useState(null);


  // ---------------------------------------
  // GET USER LOCATION
  // ---------------------------------------

  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationError(
        "Location services are not supported."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,
        });

      },

      () => {

        setLocationError(
          "Unable to access your location."
        );

        // Demo fallback
        setUserLocation({
          latitude: 26.7795,
          longitude: 82.7145,
        });

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

  }, []);


  // ---------------------------------------
  // DISASTER LOCATION
  // ---------------------------------------

  const disasterLocation =
    incident?.location?.latitude != null &&
    incident?.location?.longitude != null
      ? [
          Number(
            incident.location.latitude
          ),

          Number(
            incident.location.longitude
          ),
        ]
      : [
          26.782,
          82.719,
        ];


  // ---------------------------------------
  // USER MAP LOCATION
  // ---------------------------------------

  const userMapLocation = userLocation
    ? [
        userLocation.latitude,
        userLocation.longitude,
      ]
    : [
        26.7795,
        82.7145,
      ];


  // ---------------------------------------
  // FIND SAFEST LOCATION
  // ---------------------------------------

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(
        (lat1 * Math.PI) / 180
      ) *
        Math.cos(
          (lat2 * Math.PI) / 180
        ) *
        Math.sin(dLon / 2) ** 2;

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );
  };


  const locationsWithDistance =
    SAFE_LOCATIONS.map((place) => {

      const distance =
        calculateDistance(
          userMapLocation[0],
          userMapLocation[1],
          place.latitude,
          place.longitude
        );

      return {
        ...place,
        distance,
      };

    });


  const safestLocation =
    [...locationsWithDistance].sort(
      (a, b) =>
        a.distance - b.distance
    )[0];


  // ---------------------------------------
  // DIRECTIONS
  // ---------------------------------------

  const openDirections = (place) => {

    const destination =
      `${place.latitude},${place.longitude}`;

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  return (

    <section className="space-y-5">

      {/* HEADER */}

      <div>

        <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
          LIVE SAFETY MAP
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Find the Safest Location
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          ResQ-AI uses your location and active
          disaster information to recommend
          nearby safe locations.
        </p>

      </div>


      {/* MAP */}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#081421]">

        <div className="h-[430px]">

          <MapContainer
            center={userMapLocation}
            zoom={14}
            scrollWheelZoom={true}
            style={{
              height: "100%",
              width: "100%",
            }}
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {/* USER */}

            <Marker
              position={userMapLocation}
              icon={userIcon}
            >

              <Popup>
                <strong>
                  👤 You are here
                </strong>
              </Popup>

            </Marker>


            {/* DISASTER */}

            <Marker
              position={disasterLocation}
              icon={disasterIcon}
            >

              <Popup>

                <strong>
                  🚨 Active Disaster
                </strong>

                <br />

                {incident?.type ||
                  "Disaster zone"}

              </Popup>

            </Marker>


            {/* SAFE LOCATIONS */}

            {SAFE_LOCATIONS.map(
              (place) => (

                <Marker
                  key={place.id}
                  position={[
                    place.latitude,
                    place.longitude,
                  ]}
                  icon={shelterIcon}
                  eventHandlers={{
                    click: () =>
                      setSelectedLocation(
                        place
                      ),
                  }}
                >

                  <Popup>

                    <strong>
                      🟢 {place.name}
                    </strong>

                    <br />

                    {place.type}

                    <br />

                    Available:
                    {" "}
                    {place.available}

                  </Popup>

                </Marker>

              )
            )}


            {/* ROUTE */}

            {safestLocation && (

              <Polyline
                positions={[
                  userMapLocation,
                  [
                    safestLocation.latitude,
                    safestLocation.longitude,
                  ],
                ]}
                pathOptions={{
                  color: "#22c55e",
                  weight: 5,
                  dashArray: "10 10",
                }}
              />

            )}

          </MapContainer>

        </div>


        {/* MAP LEGEND */}

        <div className="grid grid-cols-3 gap-3 border-t border-white/10 p-4">

          <div className="rounded-xl bg-white/5 p-3">

            <p className="text-xs text-slate-500">
              YOUR LOCATION
            </p>

            <p className="mt-1 font-bold text-cyan-300">
              👤 You
            </p>

          </div>


          <div className="rounded-xl bg-white/5 p-3">

            <p className="text-xs text-slate-500">
              DISASTER
            </p>

            <p className="mt-1 font-bold text-red-400">
              🔴 Hazard
            </p>

          </div>


          <div className="rounded-xl bg-white/5 p-3">

            <p className="text-xs text-slate-500">
              SAFE
            </p>

            <p className="mt-1 font-bold text-green-400">
              🟢 Shelter
            </p>

          </div>

        </div>

      </div>


      {/* ERROR */}

      {locationError && (

        <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 text-sm text-yellow-200">

          ⚠️ {locationError}

          <br />

          Using demo location for the map.

        </div>

      )}


      {/* SAFE LOCATIONS */}

      <div>

        <div className="mb-3 flex items-center justify-between">

          <div>

            <p className="text-xs font-bold tracking-[0.2em] text-green-400">
              NEARBY SAFE LOCATIONS
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Recommended evacuation points
            </p>

          </div>

        </div>


        <div className="grid gap-4 md:grid-cols-3">

          {locationsWithDistance.map(
            (place) => (

              <div
                key={place.id}
                className={`
                  rounded-2xl
                  border
                  p-5
                  ${
                    safestLocation?.id ===
                    place.id
                      ? "border-green-400/40 bg-green-400/10"
                      : "border-white/10 bg-[#081421]"
                  }
                `}
              >

                <div className="flex items-start justify-between">

                  <div className="text-2xl">
                    {place.type === "Hospital"
                      ? "🏥"
                      : "🏠"}
                  </div>

                  {safestLocation?.id ===
                    place.id && (

                    <span className="rounded-full bg-green-400/10 px-2 py-1 text-[10px] font-bold text-green-300">
                      RECOMMENDED
                    </span>

                  )}

                </div>


                <h3 className="mt-4 font-bold text-white">
                  {place.name}
                </h3>


                <p className="mt-1 text-sm text-slate-400">
                  {place.distance.toFixed(2)} km away
                </p>


                <p className="mt-2 text-sm text-green-300">
                  Available {place.available}
                </p>


                <button
                  type="button"
                  onClick={() =>
                    openDirections(place)
                  }
                  className="mt-4 w-full rounded-xl bg-green-400 px-4 py-3 text-sm font-black text-black transition hover:bg-green-300"
                >
                  🧭 Show Route →
                </button>

              </div>

            )
          )}

        </div>

      </div>


      {/* SELECTED LOCATION */}

      {selectedLocation && (

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

          <p className="text-xs font-bold tracking-[0.2em] text-cyan-400">
            SELECTED SAFE LOCATION
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {selectedLocation.name}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {selectedLocation.type} ·{" "}
            {selectedLocation.available} places available
          </p>

          <button
            type="button"
            onClick={() =>
              openDirections(
                selectedLocation
              )
            }
            className="mt-4 rounded-xl bg-cyan-400 px-5 py-3 font-black text-black"
          >
            🧭 Navigate Here
          </button>

        </div>

      )}

    </section>

  );
};

export default SafeLocationMap;