# ResQ AI Backend — REST API

Base URL: `http://localhost:8080` (dev) · Swagger UI: `/swagger-ui.html`

Every response is wrapped:

```json
{ "success": true, "message": "OK", "data": { }, "timestamp": "2026-09-20T09:00:00Z" }
```

Errors:

```json
{ "success": false, "code": "VALIDATION_ERROR", "message": "Request validation failed",
  "fieldErrors": { "email": "email must be a valid address" },
  "path": "/api/v1/auth/register", "timestamp": "..." }
```

Authenticated routes need `Authorization: Bearer <accessToken>`.

---

## 1. Authentication

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | public | Create an account **and capture location** |
| POST | `/api/v1/auth/login` | public | Email + password → tokens |
| POST | `/api/v1/auth/refresh` | public | Rotate refresh token → new access token |
| POST | `/api/v1/auth/logout` | public | Revoke a refresh token |
| GET | `/api/v1/auth/me` | bearer | Current user |

### POST /api/v1/auth/register

```json
{
  "name": "Akash Kumar",
  "email": "akash@example.com",
  "phone": "+919876543210",
  "password": "ResQai2026",
  "role": "CITIZEN",
  "location": {
    "latitude": 26.8467,
    "longitude": 80.9462,
    "radiusKm": 300
  }
}
```

`location` is **required**. Send either coordinates (from `navigator.geolocation`)
or a free-text `address` / `city` — the backend geocodes whichever is missing.

`role` may be `CITIZEN`, `RESPONDER` or `ANALYST`. `COMMANDER` and `ADMIN` are
never self-assignable; an admin promotes users afterwards.

Password rules: 8–72 chars, at least one uppercase, one lowercase, one digit.

**201 Created**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "8fK3...",
  "tokenType": "Bearer",
  "expiresInSeconds": 900,
  "user": {
    "id": "0f1c...", "name": "Akash Kumar", "email": "akash@example.com",
    "role": "CITIZEN", "enabled": true,
    "location": {
      "latitude": 26.8467, "longitude": 80.9462,
      "city": "Lucknow", "state": "Uttar Pradesh",
      "country": "India", "countryCode": "in",
      "radiusKm": 300, "displayName": "Lucknow, Uttar Pradesh"
    }
  }
}
```

### POST /api/v1/auth/login

```json
{ "email": "akash@example.com", "password": "ResQai2026" }
```

Returns the same `AuthResponse` shape.

### POST /api/v1/auth/refresh

```json
{ "refreshToken": "8fK3..." }
```

Refresh tokens **rotate**: the old one is revoked on every use. Presenting a
already-used token revokes the entire token family for that user (theft
detection) and forces a fresh sign-in.

---

## 2. Users

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/users/me` | bearer | Profile + registered location |
| PATCH | `/api/v1/users/me` | bearer | Update name / phone |
| PUT | `/api/v1/users/me/location` | bearer | Replace location (re-scopes the news feed) |
| GET | `/api/v1/users/admin/all?page=0&size=25` | ADMIN | List users |
| PATCH | `/api/v1/users/admin/{id}/role` | ADMIN | `{ "role": "COMMANDER", "enabled": true }` |

---

## 3. Location

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/location/resolve` | public | Turn coordinates or an address into a full place |

Call this from the signup form after the browser hands over coordinates so the
user can confirm "Lucknow, Uttar Pradesh" before submitting.

---

## 4. Disaster News

All routes are authenticated and default to the location captured at
registration. `lat`, `lon`, `radiusKm` and `days` are optional overrides.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/disaster-news/feed` | bearer | Live + past + reports, one call |
| GET | `/api/v1/disaster-news/live` | bearer | Ongoing events only |
| GET | `/api/v1/disaster-news/history?days=90` | bearer | Previous events only |
| GET | `/api/v1/disaster-news/articles` | bearer | Reports / headlines only |
| GET | `/api/v1/disaster-news/sources` | ADMIN, COMMANDER, ANALYST | Upstream health |

### GET /api/v1/disaster-news/feed

```
GET /api/v1/disaster-news/feed?radiusKm=300&days=90
Authorization: Bearer <accessToken>
```

```json
{
  "location": {
    "latitude": 26.8467, "longitude": 80.9462,
    "city": "Lucknow", "state": "Uttar Pradesh",
    "country": "India", "countryCode": "in",
    "label": "Lucknow, Uttar Pradesh"
  },
  "radiusKm": 300,
  "historyDays": 90,
  "summary": {
    "liveCount": 2, "pastCount": 11, "articleCount": 9,
    "redAlerts": 0, "orangeAlerts": 1,
    "highestSeverity": "ORANGE", "nearestEventKm": 64.2
  },
  "liveEvents": [
    {
      "id": "gdacs:FL:1104233",
      "source": "GDACS",
      "type": "FLOOD",
      "title": "Flood in India",
      "description": "Flooding reported along the Gomti basin",
      "severity": "ORANGE",
      "status": "LIVE",
      "latitude": 26.72, "longitude": 81.05,
      "distanceKm": 64.2,
      "country": "India",
      "magnitude": 3.0, "magnitudeUnit": "alert score",
      "startedAt": "2026-09-17T00:00:00Z",
      "url": "https://www.gdacs.org/report.aspx?eventid=1104233"
    }
  ],
  "pastEvents": [ /* same shape, status PAST */ ],
  "newsReports": [
    {
      "id": "reliefweb:4128331",
      "source": "ReliefWeb",
      "publisher": "IFRC",
      "title": "India: Floods — Operation Update",
      "summary": "Heavy monsoon rainfall has affected districts across…",
      "url": "https://reliefweb.int/node/4128331",
      "publishedAt": "2026-09-18T11:04:00Z",
      "country": "India"
    }
  ],
  "providers": [
    { "provider": "USGS", "enabled": true, "succeeded": true, "itemCount": 4, "durationMs": 310 },
    { "provider": "GNews", "enabled": false, "succeeded": false, "itemCount": 0,
      "error": "disabled by configuration" }
  ],
  "generatedAt": "2026-09-20T09:00:00Z"
}
```

`severity` is `GREEN` | `ORANGE` | `RED` — the same three levels GDACS uses, and
they map cleanly onto the P2 / P1 / P0 language in the Priority Engine.

`type` is one of `EARTHQUAKE`, `FLOOD`, `CYCLONE`, `WILDFIRE`, `VOLCANO`,
`DROUGHT`, `LANDSLIDE`, `SEVERE_STORM`, `TSUNAMI`, `EXTREME_TEMPERATURE`, `OTHER`.

---

## Rate limits

| Scope | Limit |
|---|---|
| `/api/v1/auth/**` | 20 requests/minute/IP |
| `/api/v1/disaster-news/**` | 60 requests/minute/IP |

Exceeding either returns `429` with `Retry-After: 60`. Headers
`X-RateLimit-Limit` and `X-RateLimit-Remaining` are on every response.
