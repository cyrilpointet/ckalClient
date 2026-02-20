import { Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useLogin } from "@/features/account/api/useAuth"
import { loginSchema, type LoginInput } from "@/features/account/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { AuthPageLayout } from "@/components/AuthPageLayout"
import { AxiosError } from "axios"

export function LoginPage() {
  const { t } = useTranslation()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginInput) => {
    login.mutate(data)
  }

  const apiError =
    login.error instanceof AxiosError
      ? login.error.response?.data?.message ?? t("features.auth.views.LoginPage.error")
      : login.error
        ? t("features.auth.views.LoginPage.error")
        : null

  return (
    <AuthPageLayout title={t("features.auth.views.LoginPage.title")}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {apiError && (
              <p className="text-sm text-destructive text-center">
                {apiError}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("features.auth.views.LoginPage.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("features.auth.views.LoginPage.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("features.auth.views.LoginPage.password")}</Label>
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
              disabled={login.isPending}
            >
              {login.isPending ? t("features.auth.views.LoginPage.submitting") : t("features.auth.views.LoginPage.submit")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("features.auth.views.LoginPage.noAccount")}{" "}
              <Link
                to="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                {t("features.auth.views.LoginPage.createAccount")}
              </Link>
            </p>
          </CardFooter>
        </form>
    </AuthPageLayout>
  )
}
