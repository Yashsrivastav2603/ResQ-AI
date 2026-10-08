# ResQ AI — Spring Boot Backend

The `backend/` module of [ResQ-AI](https://github.com/akashgitty/ResQ-AI).
A modular monolith, exactly as the architecture diagram calls for: one Spring
Boot service, PostgreSQL as the source of truth, JWT + Spring Security RBAC,
and a location-scoped Disaster News module.

What is in here now:

| Module | Package | Status |
|---|---|---|
| Authentication & authorization | `security`, `auth` | done |
| Users & roles (RBAC) | `user` | done |
| Location capture & geocoding | `location` | done |
| Disaster News (live / past / reports) | `news` | done |
| Incidents, resources, priority engine | — | next, see "Where this plugs in" |

---

## Quick start

```bash
cd backend

cp .env.example .env          # then edit JWT_SECRET at minimum
docker compose up --build     # PostgreSQL + backend on :8080
```

Or run against an in-memory database while you wire the frontend, no
PostgreSQL needed:

```bash
export JWT_SECRET="$(openssl rand -base64 48)"
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Check it:

```bash
curl http://localhost:8080/actuator/health
open http://localhost:8080/swagger-ui.html
```

Full endpoint reference: **[API.md](./API.md)**.

---

## The three things you asked for

### 1. Authentication and authorization

- **BCrypt** (strength 12) password hashing, never plaintext anywhere.
- **JWT access tokens** (HS256, 15 min) carrying `sub`, `email`, `name`, `role`.
- **Opaque refresh tokens** (7 days) stored as SHA-256 digests in
  `refresh_tokens`, so a database dump cannot be replayed. They **rotate** on
  every use; replaying a spent token revokes the whole family for that user.
- **Stateless sessions** — no server-side session, which is what lets you scale
  the monolith horizontally later.
- **RBAC** across the five roles from the diagram: `ADMIN`, `COMMANDER`,
  `RESPONDER`, `ANALYST`, `CITIZEN`. Route rules live in `SecurityConfig`;
  `@PreAuthorize` is enabled for finer method-level rules as you add incidents
  and resources.
- `COMMANDER` and `ADMIN` are **not self-assignable** at signup. An admin
  promotes people via `PATCH /api/v1/users/admin/{id}/role`.
- **CORS** is pinned to your Vercel origin plus localhost (`CORS_ORIGINS`).
- **Rate limiting** on auth and news routes — the Redis counter pattern from the
  architecture, running in-process for now (`RateLimitFilter`).
- Uniform JSON errors via `GlobalExceptionHandler`; 401 and 403 come back as
  JSON, not HTML error pages.

### 2. Login and signup

`POST /api/v1/auth/register` and `POST /api/v1/auth/login`, both returning the
same `AuthResponse` so the frontend has one code path.

**Location is mandatory at registration.** That is the design decision the whole
Disaster News feature rests on: if we cannot place a user on the map, their feed
would be meaningless, so registration fails fast with a clear message rather
than creating an account that can never show anything.

The signup form can send either:

```json
"location": { "latitude": 26.8467, "longitude": 80.9462 }
```

from `navigator.geolocation`, **or**

```json
"location": { "city": "Lucknow", "state": "Uttar Pradesh", "country": "India" }
```

typed by the user. The backend fills in whichever half is missing by
geocoding against OpenStreetMap Nominatim (free, no key), storing
latitude, longitude, city, district, state, country, ISO country code,
postal code and the user's preferred radius.

Geocoding failure never blocks signup — it only blocks if we end up with no
coordinates at all.

### 3. Disaster News, scoped to the registered location

`GET /api/v1/disaster-news/feed` returns the whole section in one call: what is
happening **now**, what happened **before**, and the **reports** around it.

Four upstreams, fanned out in parallel, normalised into one event shape:

| Provider | Covers | Key needed | How location is applied |
|---|---|---|---|
| **USGS FDSN** | Earthquakes | no | Native circle search: `latitude` + `longitude` + `maxradiuskm` |
| **GDACS** | EQ, cyclone, flood, volcano, drought, wildfire, with official Green/Orange/Red alert levels | no | Global window pulled, then haversine-filtered to your radius |
| **NASA EONET v3** | Open natural events — wildfires, severe storms, volcanoes, landslides | no | Bounding box around your point, then haversine-filtered |
| **ReliefWeb (UN OCHA)** | Situation reports and disaster bulletins | appname | Filtered to your country, searched on your city/state |
| **GNews** | Mainstream headlines | free API key | `country` = your ISO code, query built from your city + hazard keywords |

Design notes worth knowing:

- **No single point of failure.** Each provider runs on its own future with a
  hard timeout. If GDACS is down you still get USGS, EONET and the articles,
  plus a `providers[]` array telling the UI exactly what was missing and why —
  so the screen says "GDACS unavailable" instead of quietly showing an empty
  list.
- **Results are deduplicated and ranked** red-first, then nearest, then most
  recent. Anything shown in `liveEvents` is suppressed from `pastEvents`.
- **Caching** is keyed on a ~1 km coordinate grid plus radius, so everyone in
  the same neighbourhood shares one upstream call. Live results live for 5
  minutes, history for 30, articles for 15. Swap the Caffeine `CacheManager`
  for `RedisCacheManager` and nothing in the news module changes.
- **Severity** is normalised to `GREEN` / `ORANGE` / `RED`, which maps directly
  onto the P2 / P1 / P0 language your Priority Engine already speaks.
- The feed can be **re-scoped on the fly** with `?radiusKm=` / `?days=` /
  `?lat=&lon=` without touching the stored profile — that is the "change area"
  control on the dashboard. Changing it permanently is
  `PUT /api/v1/users/me/location`.

---

## Configuration

Everything is environment-driven; see `.env.example`.

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | **yes** | ≥32 bytes. `openssl rand -base64 48`. The app refuses to start with a short one. |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | yes (prod) | PostgreSQL |
| `CORS_ORIGINS` | yes | Comma-separated. Must include your Vercel URL. |
| `GEOCODER_USER_AGENT` | recommended | Nominatim's usage policy requires a real contact address here. |
| `GNEWS_API_KEY` | optional | Free key from gnews.io. Blank = provider reports itself disabled, feed still works. |
| `RELIEFWEB_APPNAME` | optional | ReliefWeb v2 has required a pre-approved appname since Nov 2025 — request one at apidoc.reliefweb.int. Set `RELIEFWEB_ENABLED=false` to skip it. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | optional | Creates the first ADMIN on an empty database. |

---

## Connecting the frontend

Two drop-in files are in `../frontend-integration/`:

- `api.js` → `frontend/src/lib/api.js` — token storage, silent refresh on 401,
  and typed helpers for every endpoint.
- `DisasterNews.jsx` → `frontend/src/pages/DisasterNews.jsx` — the section
  wired to `/disaster-news/feed`, with live/past/reports tabs and a radius
  control. Structure and class names only, so it picks up your existing styles.

Set in `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

and in Vercel's environment settings, your deployed backend URL.

---

## Where this plugs in next

The architecture's remaining modules drop into the same shape — a package with
an entity, a repository, a service and a controller, guarded by the RBAC already
in place:

- `incident/` — create / update / status / lifecycle, `@PreAuthorize` on
  `RESPONDER` and above.
- `resource/` — ambulances, rescue teams, medical units, availability, capacity.
- `priority/` — the deterministic 0–100 explainable scorer.
- `allocation/` — the greedy matcher, with commander approval before dispatch.
- `notification/` and `audit/` — the audit module especially, since
  `GlobalExceptionHandler` and the security context already give you the
  "who did what, when" primitives.

The AI service (FastAPI) stays a separate process; call it from a
`RestClient` bean configured exactly like `externalRestClient` — timeouts,
fallback and an explicit status, so an AI outage degrades the feature instead of
taking the backend down.

---

## Attribution

Disaster data used under the terms of its providers. When you display GDACS
events, credit *"Global Disaster Alert and Coordination System, GDACS"*.
Geocoding is © OpenStreetMap contributors.
