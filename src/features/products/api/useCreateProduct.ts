import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"
import type { CreateProductPayload, Product } from "../types"
import { AxiosError } from "axios"

export function useCreateProduct() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: CreateProductPayload) =>
      apiClient.post<Product>("/products/", input).then((r) => r.data),
    onSuccess: (product) => {
      navigate({ to: "/products/$productId", params: { productId: product.id } })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? i18n.t("features.products.api.useCreateProduct.error")
          : i18n.t("features.products.api.useCreateProduct.error")
      toast.error(message)
    },
  })
}
