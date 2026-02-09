import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export const registerSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
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
