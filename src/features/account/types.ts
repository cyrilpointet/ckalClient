import { z } from "zod"
import i18n from "@/i18n/i18n"

export const loginSchema = z.object({
  email: z.string().email(i18n.t("features.auth.types.invalidEmail")),
  password: z.string().min(1, i18n.t("features.auth.types.passwordRequired")),
})

export const registerSchema = z.object({
  username: z.string().min(1, i18n.t("features.auth.types.usernameRequired")),
  email: z.string().email(i18n.t("features.auth.types.invalidEmail")),
  password: z.string().min(6, i18n.t("features.auth.types.minChars")),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export interface User {
  id: string
  email: string
  username: string
  isSuperadmin: boolean
  dailyCalories: number | null
}

export interface AuthToken {
  type: string
  name: string | null
  token: string
  abilities: string[]
  lastUsedAt: string | null
  expiresAt: string | null
}

export interface DailyCalorie {
  id: string
  userId: string
  value: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: AuthToken
  lastDailyCalorie: DailyCalorie | null
}
