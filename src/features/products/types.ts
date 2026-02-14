import { z } from "zod"
import i18n from "@/i18n/i18n"

export const createProductSchema = z.object({
  name: z.string().min(1, i18n.t("features.products.types.nameRequired")),
  description: z.string().nullable(),
  kcal: z
    .number()
    .int(i18n.t("features.products.types.mustBeInteger"))
    .min(1, i18n.t("features.products.types.mustBePositive")),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export interface CreateProductPayload {
  name: string
  description: string | null
  kcal: number
  isRecipe: boolean
}

export interface Product {
  id: string
  userId: string
  name: string
  description: string | null
  kcal: number
  isRecipe: boolean
  createdAt: string
  updatedAt: string
}
