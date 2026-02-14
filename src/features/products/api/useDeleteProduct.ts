import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"
import { AxiosError } from "axios"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) =>
      apiClient.delete(`/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? i18n.t("features.products.api.useDeleteProduct.error")
          : i18n.t("features.products.api.useDeleteProduct.error")
      toast.error(message)
    },
  })
}
