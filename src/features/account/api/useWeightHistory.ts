import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"

export interface Weight {
  id: string
  value: number
  date: string
}

export function useWeightHistory(from: string, to: string) {
  return useQuery({
    queryKey: ["weights", "history", from, to],
    queryFn: () =>
      apiClient
        .get<Weight[]>("/weights", { params: { sort: "asc", from, to } })
        .then((r) => r.data),
  })
}
