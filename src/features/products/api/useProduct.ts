import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "../types"

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () =>
      apiClient.get<Product>(`/products/${id}`).then((r) => r.data),
  })
}
