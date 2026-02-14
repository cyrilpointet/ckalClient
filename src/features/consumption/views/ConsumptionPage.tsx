import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { addDays, format, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Trash2 } from "lucide-react"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { useDeleteConsumedProduct } from "@/features/consumption/api/useDeleteConsumedProduct"
import { useUser } from "@/features/auth/api/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function ConsumptionPage() {
  const { t } = useTranslation()
  const [date, setDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { data: user } = useUser()
  const { data: consumedProducts, isLoading } = useConsumedProducts(date)
  const deleteConsumedProduct = useDeleteConsumedProduct()

  const totalKcal =
    consumedProducts?.reduce((sum, p) => sum + p.product.kcal * p.quantity, 0) ?? 0
  const dailyCalories = user?.dailyCalories ?? null
  const isOver = dailyCalories !== null && totalKcal > dailyCalories

  return (
    <PageLayout title={format(date, "EEEE d MMMM yyyy", { locale: fr }).replace(/^\w/, (c) => c.toUpperCase())}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate(subDays(date, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d)
                    setIsCalendarOpen(false)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate(addDays(date, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.consumption.views.ConsumptionPage.loading")}
          </p>
        )}

        {consumedProducts && consumedProducts.length > 0 && (
          <>
            <ul className="divide-y">
              {consumedProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-1 text-sm"
                >
                  <Link
                    to="/products/$productId"
                    params={{ productId: product.productId }}
                    className="flex flex-1 items-center justify-between rounded px-2 py-2 transition-colors hover:bg-accent"
                  >
                    <span>
                      {product.product.name}
                      {product.quantity > 1 && (
                        <span className="text-muted-foreground"> x{product.quantity}</span>
                      )}
                    </span>
                    <span className="font-medium">
                      {product.product.kcal * product.quantity} kcal
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(product.id)}
                    className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
              <span>{t("features.consumption.views.ConsumptionPage.total")}</span>
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
                {t("features.consumption.views.ConsumptionPage.kcal")}
              </span>
            </div>
          </>
        )}

        {consumedProducts && consumedProducts.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.consumption.views.ConsumptionPage.empty")}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link to="/recipe-generator" className="w-full">
          <Button variant="outline" className="w-full"><Sparkles className="h-4 w-4" />{t("features.consumption.views.ConsumptionPage.createRecipe")}</Button>
        </Link>
        <Link to="/products" className="w-full">
          <Button className="w-full">{t("features.consumption.views.ConsumptionPage.add")}</Button>
        </Link>
      </CardFooter>
      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("features.consumption.views.ConsumptionPage.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("features.consumption.views.ConsumptionPage.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("features.consumption.views.ConsumptionPage.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  deleteConsumedProduct.mutate(itemToDelete)
                  setItemToDelete(null)
                }
              }}
            >
              {t("features.consumption.views.ConsumptionPage.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}
