import React, { useEffect, useState } from "react";
import { disasterNews } from "../services/news";

/**
 * Drop-in replacement for the hardcoded "Latest Disaster News" list on Home.
 * Pulls live + recent events scoped to the signed-in user's registered
 * location. Refreshes every 5 minutes to match the backend's cache window.
 */
function DisasterNewsCard() {
  const [feed, setFeed] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await disasterNews.feed({ radiusKm: 300 });
        if (!cancelled) {
          setFeed(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const items = feed
    ? [...feed.liveEvents, ...feed.pastEvents].slice(0, 3)
    : [];

  return (
    <div id="news" className="rounded-3xl border border-white/10 bg-[#081421] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">INFORMATION</p>
          <h3 className="mt-1 text-2xl font-bold">Latest Disaster News</h3>
          {feed && (
            <p className="mt-1 text-xs text-slate-600">
              Near {feed.location.label}
            </p>
          )}
        </div>

        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
          LIVE FEED
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {loading && (
          <p className="text-sm text-slate-500">Loading disaster news for your area…</p>
        )}

        {!loading && error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-slate-500">
            Nothing reported in your area right now.
          </p>
        )}

        {!loading &&
          !error &&
          items.map((event) => (
            
              key={event.id}
              href={event.url || "#"}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-white/5 bg-white/3 p-4 transition hover:bg-white/6"
            >
              <div className="flex gap-3">
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    event.severity === "RED"
                      ? "bg-red-500"
                      : event.severity === "ORANGE"
                      ? "bg-yellow-400"
                      : "bg-cyan-400"
                  }`}
                />

                <div>
                  <p className="text-sm leading-6 text-slate-300">
                    {event.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {event.distanceKm != null &&
                      `${Math.round(event.distanceKm)} km away · `}
                    {event.source}
                    {event.status === "LIVE" ? " · Ongoing" : ""}
                  </p>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default DisasterNewsCard;
