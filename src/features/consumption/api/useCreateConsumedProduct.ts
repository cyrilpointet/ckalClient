import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"

interface CreateConsumedProductPayload {
  productId: string
  consumedAt: string
  quantity: number
}

export function useCreateConsumedProduct() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: CreateConsumedProductPayload) =>
      apiClient.post("/consumed-products/", input),
    onSuccess: () => {
      navigate({ to: "/consumption" })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? i18n.t("features.consumption.api.useCreateConsumedProduct.error")
          : i18n.t("features.consumption.api.useCreateConsumedProduct.error")
      toast.error(message)
    },
  })
}
