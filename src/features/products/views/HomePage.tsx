import { useTranslation } from "react-i18next"
import { useUser } from "@/features/account/api/useAuth"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { cn } from "@/lib/utils"
import { CaloriesProgressBar } from "@/features/consumption/components/CaloriesProgressBar"
import { CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { Link } from "@tanstack/react-router"
import { ChevronRight, Star } from "lucide-react"
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
            {dailyCalories !== null && (
              <CaloriesProgressBar value={totalKcal} max={dailyCalories} className="mt-2" />
            )}
            {isOver && (
              <p className="mt-1 text-sm text-destructive">
                {t("features.products.views.HomePage.caloriesExceeded")}
              </p>
            )}
            <p className="flex items-center justify-end gap-1 text-sm text-muted-foreground mt-4 font-semibold">
              {t("features.products.views.HomePage.manageConsumption")}
              <ChevronRight className="h-4 w-4" />
            </p>
          </button>
        </Link>

        <Link to="/recipe-generator" className="w-full">
          <button className="relative w-full rounded-md border-neutral-foreground border p-4 grid grid-cols-2 items-center justify-between bg-primary/60 font-bold">
            <div className="absolute top-2 right-2 flex gap-0.5">
              <Star className="h-5 w-5 fill-chart-4 text-chart-4" />
              <Star className="h-5 w-5 fill-chart-4 text-chart-4" />
              <Star className="h-5 w-5 fill-chart-4 text-chart-4" />
            </div>
            <img
              src={chefImage}
              alt="Empty"
              className="mx-auto w-30 h-30"
            />
            <p className="text-sm">{t("features.products.views.HomePage.recipePromo")}</p>
          </button>
        </Link>

        <PictureProductDialog>
          <button className="w-full rounded-md border-neutral-foreground border p-4 grid grid-cols-2 items-center justify-between">
            <p className="text-sm text-muted-foreground font-semibold">{t("features.products.views.HomePage.foodPhotoPromo")}</p>
            <img
              src={foodPhotoImage}
              alt="Scan"
              className="mx-auto w-30 h-30"
            />
          </button>
        </PictureProductDialog>
        <ScanProductDialog>
          <button className="w-full rounded-md border-neutral-foreground border p-4 grid grid-cols-2 items-center justify-between">
            <img
              src={scanImage}
              alt="Scan"
              className="mx-auto w-30 h-30"
            />
            <p className="text-sm text-muted-foreground font-semibold">{t("features.products.views.HomePage.scanPromo")}</p>
          </button>
        </ScanProductDialog>
      </CardContent>
    </PageLayout>
  )
}
