import { Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useRegister } from "@/features/account/api/useAuth"
import { registerSchema, type RegisterInput } from "@/features/account/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { AuthPageLayout } from "@/components/AuthPageLayout"
import { AxiosError } from "axios"

import LogoImage from "@/assets/Logo_white.svg"

export function RegisterPage() {
  const { t } = useTranslation()
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data)
  }

  const apiError =
    registerMutation.error instanceof AxiosError
      ? registerMutation.error.response?.data?.message === "Email already in use"
        ? t("features.auth.views.RegisterPage.emailAlreadyInUse")
        : t("features.auth.views.RegisterPage.error")
      : registerMutation.error
        ? t("features.auth.views.RegisterPage.error")
        : null

  if (registerMutation.isSuccess) {
    return (
      <AuthPageLayout title={t("features.auth.views.RegisterPage.title")}>
        <img src={LogoImage} alt="Logo" className="mx-auto mb-4 h-10 text-primary" />
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {t("features.auth.views.RegisterPage.emailSent")}
          </p>
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline text-sm"
          >
            {t("features.auth.views.RegisterPage.login")}
          </Link>
        </CardContent>
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout title={t("features.auth.views.RegisterPage.title")}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {apiError && (
            <p className="text-sm text-destructive text-center">
              {apiError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">{t("features.auth.views.RegisterPage.username")}</Label>
            <Input
              id="username"
              placeholder={t("features.auth.views.RegisterPage.usernamePlaceholder")}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("features.auth.views.RegisterPage.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("features.auth.views.RegisterPage.emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("features.auth.views.RegisterPage.password")}</Label>
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
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? t("features.auth.views.RegisterPage.submitting") : t("features.auth.views.RegisterPage.submit")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("features.auth.views.RegisterPage.hasAccount")}{" "}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("features.auth.views.RegisterPage.login")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </AuthPageLayout>
  )
}
