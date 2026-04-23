import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pinsApi } from "../api/pins";
import type { CreatePinPayload, UpdatePinPayload } from "../types";

export const pinKeys = {
  all: ["pins"] as const,
  list: () => [...pinKeys.all, "list"] as const,
  detail: (id: string) => [...pinKeys.all, "detail", id] as const,
};

export function usePins() {
  return useQuery({
    queryKey: pinKeys.list(),
    queryFn: pinsApi.getAll,
  });
}

export function usePin(id: string) {
  return useQuery({
    queryKey: pinKeys.detail(id),
    queryFn: () => pinsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePinPayload) => pinsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pinKeys.list() });
    },
  });
}

export function useUpdatePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePinPayload }) =>
      pinsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: pinKeys.list() });
      queryClient.invalidateQueries({ queryKey: pinKeys.detail(variables.id) });
    },
  });
}

export function useDeletePin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pinsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pinKeys.list() });
    },
  });
}
