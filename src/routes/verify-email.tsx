import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { VerifyEmailPage } from "@/features/account/views/VerifyEmailPage"

const searchSchema = z.object({
  token: z.string(),
})

export const Route = createFileRoute("/verify-email")({
  validateSearch: searchSchema,
  component: VerifyEmailPage,
})
