import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import apiClient from "@/lib/axios"
import type { DailyCalorie, User } from "../types"
import { AxiosError } from "axios"

export function useUpdateDailyCalories() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (dailyCalories: number) =>
      apiClient
        .post<DailyCalorie>("/daily-calories", { value: dailyCalories })
        .then((r) => r.data),
    onSuccess: (dailyCalorie) => {
      const raw = localStorage.getItem("user")
      if (raw) {
        const user = JSON.parse(raw) as User
        user.dailyCalories = dailyCalorie.value
        localStorage.setItem("user", JSON.stringify(user))
        queryClient.setQueryData(["user"], user)
      }
      navigate({ to: "/" })
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ?? "Erreur lors de la mise à jour"
          : "Erreur lors de la mise à jour"
      toast.error(message)
    },
  })
}
