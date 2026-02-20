import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CaloriesProgressBar } from "@/features/consumption/components/CaloriesProgressBar"
import type { ConsumedProduct } from "@/features/consumption/types"

interface ConsumptionSummaryProps {
  consumedProducts: ConsumedProduct[]
  dailyCalories: number | null
  onDeleteItem: (id: string) => void
}

export function ConsumptionSummary({ consumedProducts, dailyCalories, onDeleteItem }: ConsumptionSummaryProps) {
  const { t } = useTranslation()

  const totalKcal = Math.round(
    consumedProducts.reduce((sum, p) => sum + p.product.kcal * p.quantity, 0),
  )
  const totalProtein = Math.round(
    consumedProducts.reduce((sum, p) => sum + (p.product.protein ?? 0) * p.quantity, 0) * 10,
  ) / 10
  const totalCarbohydrate = Math.round(
    consumedProducts.reduce((sum, p) => sum + (p.product.carbohydrate ?? 0) * p.quantity, 0) * 10,
  ) / 10
  const totalLipid = Math.round(
    consumedProducts.reduce((sum, p) => sum + (p.product.lipid ?? 0) * p.quantity, 0) * 10,
  ) / 10
  const hasMacros = totalProtein > 0 || totalCarbohydrate > 0 || totalLipid > 0
  const isOver = dailyCalories !== null && totalKcal > dailyCalories
  const caloriesLeft = Math.max(dailyCalories !== null ? dailyCalories - totalKcal : 0, 0)

  return (
    <div>
      <p className="font-semibold mb-2 text-center">
        {t("features.consumption.components.ConsumptionSummary.title")}
      </p>
      <ul className="divide-y">
        {consumedProducts.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-1 text-sm"
          >
            <Link
              to="/products/$productId"
              params={{ productId: product.productId }}
              className="flex flex-1 items-center gap-2 rounded px-2 py-2 transition-colors hover:bg-accent min-w-0"
            >
              <span className="flex items-center flex-1 min-w-0">
                <span className="line-clamp-2">{product.product.name}</span>
                {product.quantity > 1 && (
                  <span className="text-muted-foreground whitespace-nowrap shrink-0 ml-1"> x{product.quantity}</span>
                )}
              </span>
              <span className="font-medium whitespace-nowrap ml-auto">
                {Math.round(product.product.kcal * product.quantity)} kcal
              </span>
            </Link>
            <button
              type="button"
              onClick={() => onDeleteItem(product.id)}
              className="p-1 transition-colors text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between border-t pt-4 font-semibold">
        <span>{t("features.consumption.components.ConsumptionSummary.total")}</span>
        <span>
          <span className={cn(isOver && "text-destructive")}>
            {totalKcal}
          </span>
          {dailyCalories !== null && (
            <span className="font-normal text-muted-foreground">
              {" "}
              / {dailyCalories}
            </span>
          )}{" "}
          {t("features.consumption.components.ConsumptionSummary.kcal")}
        </span>
      </p>
      {hasMacros && (
        <p className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <span>{t("components.ProductViewer.protein")}: <span className="font-medium text-foreground">{totalProtein}g</span></span>
          <span>{t("components.ProductViewer.carbohydrate")}: <span className="font-medium text-foreground">{totalCarbohydrate}g</span></span>
          <span>{t("components.ProductViewer.lipid")}: <span className="font-medium text-foreground">{totalLipid}g</span></span>
        </p>
      )}
      {dailyCalories !== null && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {t("features.consumption.components.ConsumptionSummary.caloriesLeft", { caloriesLeft })}{" "}
            <span className="font-semibold">{caloriesLeft} kcal</span>
          </p>
          <CaloriesProgressBar value={totalKcal} max={dailyCalories} className="mt-2" />
        </div>
      )}
    </div>
  )
}
