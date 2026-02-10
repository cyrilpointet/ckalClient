import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().nullable(),
  kcal: z
    .number()
    .int("Doit être un entier")
    .min(1, "Doit être supérieur à 0"),
  consumedAt: z.date({ message: "Date requise" }),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export interface CreateProductPayload {
  name: string
  description: string | null
  kcal: number
  consumedAt: string
}

export interface Product {
  id: string
  userId: string
  name: string
  description: string | null
  kcal: number
  consumedAt: string
  createdAt: string
  updatedAt: string
}
