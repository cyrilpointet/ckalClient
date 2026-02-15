import { createFileRoute, redirect } from "@tanstack/react-router"
import { DailyCaloriesPage } from "@/features/account/views/DailyCaloriesPage"

export const Route = createFileRoute("/daily-calories")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: DailyCaloriesPage,
})
