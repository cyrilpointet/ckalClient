import { useInfiniteQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "../types"

interface ProductsResponse {
  data: Product[]
  totalCount: number
}

export const PRODUCTS_TAKE = 10

export function useProducts(name?: string) {
  return useInfiniteQuery({
    queryKey: ["products", name],
    queryFn: ({ pageParam }) =>
      apiClient
        .get<ProductsResponse>("/products", {
          params: { take: PRODUCTS_TAKE, skip: pageParam, sort: "-updated_at", ...(name && { name }) },
        })
        .then((r) => r.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0)
      return loaded < lastPage.totalCount ? loaded : undefined
    },
  })
}
