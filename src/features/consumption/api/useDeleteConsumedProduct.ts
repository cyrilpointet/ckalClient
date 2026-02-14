import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"

export function useDeleteConsumedProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/consumed-products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumed-products"] })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? i18n.t("features.consumption.api.useDeleteConsumedProduct.error")
          : i18n.t("features.consumption.api.useDeleteConsumedProduct.error")
      toast.error(message)
    },
  })
}
