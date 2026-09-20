import { request } from "./coreApi";

export const location = {
  resolve: (payload) => request("/api/v1/location/resolve", { method: "POST", body: payload, auth: false }),
};
