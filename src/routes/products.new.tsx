import { createFileRoute, redirect } from "@tanstack/react-router"
import { NewProductPage } from "@/features/products/views/NewProductPage"

interface NewProductSearch {
  name?: string
  description?: string
  kcal?: number
  protein?: number
  carbohydrate?: number
  lipid?: number
}

export const Route = createFileRoute("/products/new")({
  validateSearch: (search: Record<string, unknown>): NewProductSearch => ({
    name: typeof search.name === "string" ? search.name : undefined,
    description:
      typeof search.description === "string" ? search.description : undefined,
    kcal: typeof search.kcal === "number" ? search.kcal : undefined,
    protein: typeof search.protein === "number" ? search.protein : undefined,
    carbohydrate: typeof search.carbohydrate === "number" ? search.carbohydrate : undefined,
    lipid: typeof search.lipid === "number" ? search.lipid : undefined,
  }),
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: NewProductRoute,
})

function NewProductRoute() {
  const search = Route.useSearch()
  return (
    <NewProductPage
      defaultName={search.name}
      defaultDescription={search.description}
      defaultKcal={search.kcal}
      defaultProtein={search.protein}
      defaultCarbohydrate={search.carbohydrate}
      defaultLipid={search.lipid}
    />
  )
}
