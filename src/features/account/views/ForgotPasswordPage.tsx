import { Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useForgotPassword } from "@/features/account/api/useAuth"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/account/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { AuthPageLayout } from "@/components/AuthPageLayout"
import { AxiosError } from "axios"

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const forgotPassword = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword.mutate(data)
  }

  const apiError =
    forgotPassword.error instanceof AxiosError
      ? forgotPassword.error.response?.data?.message ?? t("features.auth.views.ForgotPasswordPage.error")
      : forgotPassword.error
        ? t("features.auth.views.ForgotPasswordPage.error")
        : null

  if (forgotPassword.isSuccess) {
    return (
      <AuthPageLayout title={t("features.auth.views.ForgotPasswordPage.title")}>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t("features.auth.views.ForgotPasswordPage.emailSent")}
          </p>
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline text-sm"
          >
            {t("features.auth.views.ForgotPasswordPage.backToLogin")}
          </Link>
        </CardContent>
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout title={t("features.auth.views.ForgotPasswordPage.title")}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {apiError && (
            <p className="text-sm text-destructive text-center">
              {apiError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("features.auth.views.ForgotPasswordPage.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("features.auth.views.ForgotPasswordPage.emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-8">
          <Button
            type="submit"
            className="w-full"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? t("features.auth.views.ForgotPasswordPage.submitting") : t("features.auth.views.ForgotPasswordPage.submit")}
          </Button>
          <Link
            to="/login"
            className="text-sm text-muted-foreground text-primary underline-offset-4 hover:underline"
          >
            {t("features.auth.views.ForgotPasswordPage.backToLogin")}
          </Link>
        </CardFooter>
      </form>
    </AuthPageLayout>
  )
}
