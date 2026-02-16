import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { ConsumedProduct } from "../types"

export interface DailyCalorie {
  date: string
  kcal: number
}

export function useDailyCalories(from: string, to: string) {
  return useQuery({
    queryKey: ["consumed-products", "daily-calories", from, to],
    queryFn: async () => {
      const fromISO = new Date(from).toISOString()
      const toISO = new Date(to + "T23:59:59").toISOString()

      const { data } = await apiClient.get<ConsumedProduct[]>("/consumed-products", {
        params: { from: fromISO, to: toISO },
      })

      const byDay = new Map<string, number>()
      for (const cp of data) {
        const day = cp.consumedAt.slice(0, 10)
        byDay.set(day, (byDay.get(day) ?? 0) + Math.round(cp.product.kcal * cp.quantity))
      }

      return Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, kcal]) => ({ date, kcal }))
    },
  })
}
