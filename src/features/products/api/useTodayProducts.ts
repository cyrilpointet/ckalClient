import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "../types"

function getTodayDate() {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}

export function useTodayProducts() {
  const date = getTodayDate()

  return useQuery({
    queryKey: ["products", date],
    queryFn: () =>
      apiClient
        .get<Product[]>("/products", { params: { date } })
        .then((r) => r.data),
  })
}
