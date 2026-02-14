import { useTranslation } from "react-i18next"
import { useUser } from "@/features/auth/api/useAuth"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { cn } from "@/lib/utils"
import { CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function HomePage() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { data: consumedProducts } = useConsumedProducts(new Date())

  const totalKcal =
    consumedProducts?.reduce((sum, p) => sum + p.product.kcal, 0) ?? 0
  const dailyCalories = user?.dailyCalories ?? null
  const isOver = dailyCalories !== null && totalKcal > dailyCalories

  return (
    <PageLayout title={user?.username ? t("features.products.views.HomePage.welcomeUser", { username: user.username }) : t("features.products.views.HomePage.welcome")}>
        <CardContent className="flex flex-col gap-6">
          <div className="text-center">
            <p
              className={cn(
                "text-3xl font-bold",
                isOver && "text-destructive",
              )}
            >
              {totalKcal}
              {dailyCalories !== null && (
                <span className="text-lg font-normal text-muted-foreground">
                  {" "}
                  / {dailyCalories} {t("features.products.views.HomePage.kcal")}
                </span>
              )}
              {dailyCalories === null && (
                <span className="text-lg font-normal text-muted-foreground">
                  {" "}
                  {t("features.products.views.HomePage.kcal")}
                </span>
              )}
            </p>
            {isOver && (
              <p className="mt-1 text-sm text-destructive">
                {t("features.products.views.HomePage.caloriesExceeded")}
              </p>
            )}
          </div>
        </CardContent>
    </PageLayout>
  )
}
