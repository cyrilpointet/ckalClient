import { useTranslation } from "react-i18next"
import { useVerifyEmail } from "@/features/account/api/useAuth"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { AuthPageLayout } from "@/components/AuthPageLayout"
import { Route } from "@/routes/verify-email"

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const { token } = Route.useSearch()
  const verifyMutation = useVerifyEmail()

  const onConfirm = () => {
    verifyMutation.mutate(token)
  }

  return (
    <AuthPageLayout title={t("features.auth.views.VerifyEmailPage.title")}>
      <CardContent className="space-y-4">
        {verifyMutation.error && (
          <p className="text-sm text-destructive text-center">
            {t("features.auth.views.VerifyEmailPage.error")}
          </p>
        )}
        <Button
          className="w-full"
          onClick={onConfirm}
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending
            ? t("features.auth.views.VerifyEmailPage.confirming")
            : t("features.auth.views.VerifyEmailPage.confirm")}
        </Button>
      </CardContent>
    </AuthPageLayout>
  )
}
