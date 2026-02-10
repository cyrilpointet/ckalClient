import { createFileRoute, redirect } from "@tanstack/react-router"
import { ProductsPage } from "@/features/products/views/ProductsPage"

export const Route = createFileRoute("/products/")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: ProductsPage,
})
