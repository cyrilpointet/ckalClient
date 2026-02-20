import { createFileRoute } from "@tanstack/react-router"
import { ForgotPasswordPage } from "@/features/account/views/ForgotPasswordPage"

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
})
