import { createFileRoute } from "@tanstack/react-router"
import { RegisterPage } from "@/features/auth/views/RegisterPage"

export const Route = createFileRoute("/register")({
  component: RegisterPage,
})
