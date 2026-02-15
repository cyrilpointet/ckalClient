import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"

interface Weight {
  id: string
  value: number
  date: string
}

export function useLatestWeight() {
  return useQuery({
    queryKey: ["weights", "latest"],
    queryFn: () =>
      apiClient
        .get<Weight[]>("/weights", { params: { sort: "desc", take: 1 } })
        .then((r) => r.data[0] ?? null),
  })
}
