import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"

interface CreateConsumedProductPayload {
  productId: string
  consumedAt: string
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
          ? error.response?.data?.message ?? "Erreur lors de l'ajout"
          : "Erreur lors de l'ajout"
      toast.error(message)
    },
  })
}
