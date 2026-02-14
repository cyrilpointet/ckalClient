import { useInfiniteQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "../types"

interface ProductsResponse {
  data: Product[]
  totalCount: number
}

export const RECIPES_TAKE = 5

export function useRecipes(name?: string) {
  return useInfiniteQuery({
    queryKey: ["recipes", name],
    queryFn: ({ pageParam }) =>
      apiClient
        .get<ProductsResponse>("/products", {
          params: {
            take: RECIPES_TAKE,
            skip: pageParam,
            isRecipe: true,
            ...(name && { name }),
          },
        })
        .then((r) => r.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0)
      return loaded < lastPage.totalCount ? loaded : undefined
    },
  })
}
