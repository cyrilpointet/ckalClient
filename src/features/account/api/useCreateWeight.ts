import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AxiosError } from "axios"
import apiClient from "@/lib/axios"
import i18n from "@/i18n/i18n"

interface CreateWeightPayload {
  date: string
  value: number
}

export function useCreateWeight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateWeightPayload) =>
      apiClient.post("/weights", input).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weights", "latest"] })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? i18n.t("features.auth.api.useCreateWeight.error")
          : i18n.t("features.auth.api.useCreateWeight.error")
      toast.error(message)
    },
  })
}
