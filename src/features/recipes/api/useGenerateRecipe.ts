import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"

interface GenerateRecipeInput {
  description?: string
  ingredients?: string[]
  maxKcal?: number
}

export interface GenerateRecipeResponse {
  name: string
  description: string
  total_calories: number
}

export function useGenerateRecipe() {
  return useMutation({
    mutationFn: (input: GenerateRecipeInput) =>
      apiClient
        .post<GenerateRecipeResponse>("/ai/recipe", input)
        .then((r) => r.data),
    onError: (error) => {
      if (
        error instanceof AxiosError &&
        error.response?.status === 429 &&
        error.response?.data?.retryDelay
      ) {
        toast.error(
          i18n.t("features.recipes.api.useGenerateRecipe.rateLimitError", {
            delay: error.response.data.retryDelay,
          }),
        )
        return
      }
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ??
            i18n.t("features.recipes.api.useGenerateRecipe.error")
          : i18n.t("features.recipes.api.useGenerateRecipe.error")
      toast.error(message)
    },
  })
}
