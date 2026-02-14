import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"

interface GenerateRecipeInput {
  description?: string
  ingredients?: string[]
  maxKcal?: number
}

interface GenerateRecipeResponse {
  name: string
  description: string
  kCal: number
}

export function useGenerateRecipe() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: GenerateRecipeInput) =>
      apiClient
        .post<GenerateRecipeResponse>("/ai/recipe", input)
        .then((r) => r.data),
    onSuccess: (data) => {
      navigate({
        to: "/products/new",
        search: {
          name: data.name,
          description: data.description,
          kcal: data.kCal,
        },
      })
    },
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
