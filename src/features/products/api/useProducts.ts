import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "../types"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      apiClient.get<Product[]>("/products").then((r) => r.data),
  })
}
