import { createFileRoute, redirect } from "@tanstack/react-router"
import { ConsumptionPage } from "@/features/consumption/views/ConsumptionPage"

export const Route = createFileRoute("/consumption")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: ConsumptionPage,
})
