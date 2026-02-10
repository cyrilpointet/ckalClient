import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"

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
          ? error.response?.data?.message ?? "Erreur lors de la suppression"
          : "Erreur lors de la suppression"
      toast.error(message)
    },
  })
}
