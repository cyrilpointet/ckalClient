import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import apiClient from "@/lib/axios"
import type { AuthResponse, LoginInput, RegisterInput, User } from "../types"

const USER_QUERY_KEY = ["user"] as const

function getStoredUser(): User | null {
  const raw = localStorage.getItem("user")
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function storeAuth(data: AuthResponse) {
  localStorage.setItem("token", data.token.token)
  const user: User = {
    ...data.user,
    dailyCalories: data.lastDailyCalorie?.value ?? null,
  }
  localStorage.setItem("user", JSON.stringify(user))
}

function clearAuth() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => getStoredUser(),
    initialData: getStoredUser,
    staleTime: Infinity,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiClient.post<AuthResponse>("/auth/login", input).then((r) => r.data),
    onSuccess: (data) => {
      storeAuth(data)
      queryClient.setQueryData(USER_QUERY_KEY, {
        ...data.user,
        dailyCalories: data.lastDailyCalorie?.value ?? null,
      })
      navigate({ to: "/" })
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiClient.post("/auth/register", input).then((r) => r.data),
  })
}

export function useVerifyEmail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (token: string) =>
      apiClient
        .post<AuthResponse>("/auth/verify-email", { token })
        .then((r) => r.data),
    onSuccess: (data) => {
      storeAuth(data)
      queryClient.setQueryData(USER_QUERY_KEY, {
        ...data.user,
        dailyCalories: data.lastDailyCalorie?.value ?? null,
      })
      navigate({ to: "/" })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSettled: () => {
      clearAuth()
      queryClient.setQueryData(USER_QUERY_KEY, null)
      navigate({ to: "/login" })
    },
  })
}
