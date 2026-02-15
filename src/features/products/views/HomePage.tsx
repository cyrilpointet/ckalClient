import { useTranslation } from "react-i18next"
import { useUser } from "@/features/account/api/useAuth"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { cn } from "@/lib/utils"
import { CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { ScanProductDialog } from "@/features/products/components/ScanProductDialog"
import { PictureProductDialog } from "../components/PictureProductDialog"

import chefImage from "@/assets/chef.png"
import scanImage from "@/assets/scan.png"
import foodPhotoImage from "@/assets/food-photo.png"

export function HomePage() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { data: consumedProducts } = useConsumedProducts(new Date())

  const totalKcal =
    Math.round(consumedProducts?.reduce((sum, p) => sum + p.product.kcal * p.quantity, 0) ?? 0)
  const dailyCalories = user?.dailyCalories ?? null
  const isOver = dailyCalories !== null && totalKcal > dailyCalories

  return (
    <PageLayout title={user?.username ? t("features.products.views.HomePage.welcomeUser", { username: user.username }) : t("features.products.views.HomePage.welcome")}>
      <CardContent className="flex flex-col gap-6">
        <Link to="/consumption" className="w-full">
          <button className="w-full rounded-md border-neutral-foreground border p-4">
            <p className="text-center font-bold mb-4">
              {new Date().toLocaleDateString(t("features.products.views.HomePage.locale"), {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
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
            <p className="flex items-center justify-end gap-1 text-sm text-muted-foreground mt-4">
              {t("features.products.views.HomePage.manageConsumption")}
              <ChevronRight className="h-4 w-4" />
            </p>
          </button>
        </Link>

        <ScanProductDialog>
          <button className="w-full rounded-md border-neutral-foreground border p-4 grid grid-cols-2 items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("features.products.views.HomePage.scanPromo")}</p>
            <img
              src={scanImage}
              alt="Scan"
              className="mx-auto w-30 h-30"
            />
          </button>
        </ScanProductDialog>
        <Link to="/recipe-generator" className="w-full">
          <button className="w-full rounded-md border-neutral-foreground border p-4 grid grid-cols-2 items-center justify-between">
            <img
              src={chefImage}
              alt="Empty"
              className="mx-auto w-30 h-30"
            />
            <p className="text-sm text-muted-foreground">{t("features.products.views.HomePage.recipePromo")}</p>
          </button>
        </Link>
        <PictureProductDialog>
          <button className="w-full rounded-md border-neutral-foreground border p-4 grid grid-cols-2 items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("features.products.views.HomePage.foodPhotoPromo")}</p>
            <img
              src={foodPhotoImage}
              alt="Scan"
              className="mx-auto w-30 h-30"
            />
          </button>
        </PictureProductDialog>
      </CardContent>
    </PageLayout>
  )
}
