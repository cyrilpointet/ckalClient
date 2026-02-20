import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useResetPassword } from "@/features/account/api/useAuth"
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/account/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { AuthPageLayout } from "@/components/AuthPageLayout"
import { Route } from "@/routes/reset-password"
import { AxiosError } from "axios"

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const { token } = Route.useSearch()
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = (data: ResetPasswordInput) => {
    resetPassword.mutate({ token, password: data.password })
  }

  const apiError =
    resetPassword.error instanceof AxiosError
      ? resetPassword.error.response?.data?.message ?? t("features.auth.views.ResetPasswordPage.error")
      : resetPassword.error
        ? t("features.auth.views.ResetPasswordPage.error")
        : null

  return (
    <AuthPageLayout title={t("features.auth.views.ResetPasswordPage.title")}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {apiError && (
            <p className="text-sm text-destructive text-center">
              {apiError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">{t("features.auth.views.ResetPasswordPage.password")}</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-8">
          <Button
            type="submit"
            className="w-full"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? t("features.auth.views.ResetPasswordPage.submitting") : t("features.auth.views.ResetPasswordPage.submit")}
          </Button>
        </CardFooter>
      </form>
    </AuthPageLayout>
  )
}
