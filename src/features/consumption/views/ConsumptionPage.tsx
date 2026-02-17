import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "@tanstack/react-router"
import { addDays, format, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { useDeleteConsumedProduct } from "@/features/consumption/api/useDeleteConsumedProduct"
import { useUser } from "@/features/account/api/useAuth"
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
import { Skeleton } from "@/components/ui/skeleton"
import { PageLayout } from "@/components/PageLayout"
import { ScanProductDialog } from "@/features/products/components/ScanProductDialog"
import { PictureProductDialog } from "@/features/products/components/PictureProductDialog"
import { ConsumptionSummary } from "@/features/consumption/components/ConsumptionSummary"

import servingDishImage from "@/assets/serving-dish.png"

export function ConsumptionPage() {
  const { t } = useTranslation()
  const [date, setDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { data: user } = useUser()
  const { data: consumedProducts, isLoading } = useConsumedProducts(date)
  const deleteConsumedProduct = useDeleteConsumedProduct()

  const dailyCalories = user?.dailyCalories ?? null

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
          <ul className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-center gap-2 px-2 py-2">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </li>
            ))}
          </ul>
        )}

        {consumedProducts && consumedProducts.length > 0 && (
          <ConsumptionSummary
            consumedProducts={consumedProducts}
            dailyCalories={dailyCalories}
            onDeleteItem={setItemToDelete}
          />
        )}

        {consumedProducts && consumedProducts.length === 0 && !isLoading && (
          <div>
            <img
              src={servingDishImage}
              alt="Empty"
              className="mx-auto mb-4 h-48 w-48"
            />
            <p className="text-center text-sm text-muted-foreground">
              {t("features.consumption.views.ConsumptionPage.empty")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 items-start">
        <p className="text-sm italic text-left">Besoin d'une idée recette ?</p>
        <Link to="/recipe-generator" className="w-full">
          <Button className="w-full border-chart-4 border"><Sparkles className="h-4 w-4 fill-chart-4 text-chart-4" />{t("features.consumption.views.ConsumptionPage.createRecipe")}</Button>
        </Link>
        <p className="text-sm italic text-left mt-4">Ajouter à ma consommation :</p>
        <div className="grid gap-2 grid-cols-2 w-full">
          <ScanProductDialog className="w-full" />
          <PictureProductDialog className="w-full" />
        </div>
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
