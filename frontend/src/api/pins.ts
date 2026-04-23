import type { BerryPin, CreatePinPayload, UpdatePinPayload } from "../types";
import { api } from "./client";

export const pinsApi = {
  getAll: () => api.get<BerryPin[]>("/pins"),
  getById: (id: string) => api.get<BerryPin>(`/pins/${encodeURIComponent(id)}`),
  create: (data: CreatePinPayload) => api.post<BerryPin>("/pins", data),
  update: (id: string, data: UpdatePinPayload) =>
    api.put<BerryPin>(`/pins/${encodeURIComponent(id)}`, data),
  delete: (id: string) => api.delete<void>(`/pins/${encodeURIComponent(id)}`),
};
