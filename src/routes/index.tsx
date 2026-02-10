import { createFileRoute, redirect } from "@tanstack/react-router"
import { HomePage } from "@/features/products/views/HomePage"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: HomePage,
})
