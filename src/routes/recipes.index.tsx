import { createFileRoute, redirect } from "@tanstack/react-router"
import { RecipesPage } from "@/features/products/views/RecipesPage"

export const Route = createFileRoute("/recipes/")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: RecipesPage,
})
