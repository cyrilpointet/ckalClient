import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"
import type { CreateProductPayload, Product } from "../types"

export function useUpdateProduct(productId: string) {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: CreateProductPayload) =>
      apiClient
        .put<Product>(`/products/${productId}`, input)
        .then((r) => r.data),
    onSuccess: () => {
      navigate({ to: "/products/$productId", params: { productId } })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? i18n.t("features.products.api.useUpdateProduct.error")
          : i18n.t("features.products.api.useUpdateProduct.error")
      toast.error(message)
    },
  })
}
