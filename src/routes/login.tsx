import { createFileRoute } from "@tanstack/react-router"
import { LoginPage } from "@/features/account/views/LoginPage"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})
