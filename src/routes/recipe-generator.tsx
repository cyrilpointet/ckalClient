import { createFileRoute, redirect } from "@tanstack/react-router"
import { RecipeGeneratorPage } from "@/features/recipes/views/RecipeGeneratorPage"

export const Route = createFileRoute("/recipe-generator")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: RecipeGeneratorPage,
})
