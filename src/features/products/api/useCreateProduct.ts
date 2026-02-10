import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import apiClient from "@/lib/axios"
import type { CreateProductPayload, Product } from "../types"
import { AxiosError } from "axios"

export function useCreateProduct() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: CreateProductPayload) =>
      apiClient.post<Product>("/products/", input).then((r) => r.data),
    onSuccess: () => {
      navigate({ to: "/products" })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? "Erreur lors de la création"
          : "Erreur lors de la création"
      toast.error(message)
    },
  })
}
