import { request } from "./coreApi";

const qs = (params) => {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.append(k, v);
  });
  const s = search.toString();
  return s ? `?${s}` : "";
};

export const disasterNews = {
  feed: (params) => request(`/api/v1/disaster-news/feed${qs(params)}`),
  live: (params) => request(`/api/v1/disaster-news/live${qs(params)}`),
  history: (params) => request(`/api/v1/disaster-news/history${qs(params)}`),
  articles: (params) => request(`/api/v1/disaster-news/articles${qs(params)}`),
};
