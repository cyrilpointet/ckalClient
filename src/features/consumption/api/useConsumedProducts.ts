import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { ConsumedProduct } from "../types"

function getDayRange(date: Date) {
  const from = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const to = new Date(from)
  to.setDate(to.getDate() + 1)
  return { from: from.toISOString(), to: to.toISOString() }
}

export function useConsumedProducts(date: Date) {
  const { from, to } = getDayRange(date)

  return useQuery({
    queryKey: ["consumed-products", from],
    queryFn: () =>
      apiClient
        .get<ConsumedProduct[]>("/consumed-products", { params: { from, to } })
        .then((r) => r.data),
  })
}
