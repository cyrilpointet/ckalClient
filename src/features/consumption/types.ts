import type { Product } from "@/features/products/types"

export interface ConsumedProduct {
  id: string
  userId: string
  productId: string
  quantity: number
  consumedAt: string
  createdAt: string
  updatedAt: string
  product: Product
}
