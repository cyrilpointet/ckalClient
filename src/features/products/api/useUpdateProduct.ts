import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
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
          ? error.response?.data?.message ?? "Erreur lors de la modification"
          : "Erreur lors de la modification"
      toast.error(message)
    },
  })
}
