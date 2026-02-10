import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "../types"

function getTodayRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const to = new Date(from)
  to.setDate(to.getDate() + 1)
  return { from: from.toISOString(), to: to.toISOString() }
}

export function useTodayProducts() {
  const { from, to } = getTodayRange()

  return useQuery({
    queryKey: ["products", from],
    queryFn: () =>
      apiClient
        .get<Product[]>("/products", { params: { from, to } })
        .then((r) => r.data),
  })
}
