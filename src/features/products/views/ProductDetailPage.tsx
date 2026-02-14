import { useState } from "react"
import { useTranslation } from "react-i18next"
import { marked } from "marked"
import { Link, useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useProduct } from "@/features/products/api/useProduct"
import { useDeleteProduct } from "@/features/products/api/useDeleteProduct"
import { useCreateConsumedProduct } from "@/features/consumption/api/useCreateConsumedProduct"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function ProductDetailPage({ productId }: { productId: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(productId)
  const deleteProduct = useDeleteProduct()
  const createConsumedProduct = useCreateConsumedProduct()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  if (isLoading) {
    return (
      <PageLayout>
        <p className="text-muted-foreground">{t("features.products.views.ProductDetailPage.loading")}</p>
      </PageLayout>
    )
  }

  if (!product) {
    return (
      <PageLayout>
        <p className="text-muted-foreground">{t("features.products.views.ProductDetailPage.notFound")}</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={product.name}>
      <CardContent className="flex flex-col gap-4">
        {product.isRecipe && (
          <p className="text-center text-sm italic text-muted-foreground">
            {t("features.products.views.ProductDetailPage.personalDish")}
          </p>
        )}
        {product.description && (
          <div
            className="prose prose-sm max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: marked.parse(product.description, {
                async: false,
              }) as string,
            }}
          />
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("features.products.views.ProductDetailPage.calories")}</span>
          <span className="font-medium">{product.kcal} kcal</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {product.isRecipe && (
          <>
            <Link
              to="/products/$productId/edit"
              params={{ productId: product.id }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                {t("features.products.views.ProductDetailPage.edit")}
              </Button>
            </Link>
            <Link
              to="/products/new"
              search={{
                name: product.name,
                description: product.description ?? undefined,
                kcal: product.kcal,
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                {t("features.products.views.ProductDetailPage.duplicate")}
              </Button>
            </Link>
          </>
        )}
        <Button
          className="w-full"
          onClick={() => {
            setSelectedDate(new Date())
            setIsAddOpen(true)
          }}
        >
          {t("features.products.views.ProductDetailPage.addToConsumption")}
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setIsDeleteOpen(true)}
        >
          {t("features.products.views.ProductDetailPage.delete")}
        </Button>
      </CardFooter>
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("features.products.views.ProductDetailPage.addToConsumption")}</DialogTitle>
            <DialogDescription>
              {t("features.products.views.ProductDetailPage.chooseDate")}
            </DialogDescription>
          </DialogHeader>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "PPP", { locale: fr })
                  : t("features.products.views.ProductDetailPage.pickDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d)
                  setIsDatePickerOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              {t("features.products.views.ProductDetailPage.cancel")}
            </Button>
            <Button
              disabled={!selectedDate || createConsumedProduct.isPending}
              onClick={() => {
                if (selectedDate) {
                  createConsumedProduct.mutate({
                    productId: product.id,
                    consumedAt: format(selectedDate, "yyyy-MM-dd"),
                  })
                }
              }}
            >
              {createConsumedProduct.isPending ? t("features.products.views.ProductDetailPage.adding") : t("features.products.views.ProductDetailPage.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("features.products.views.ProductDetailPage.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("features.products.views.ProductDetailPage.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("features.products.views.ProductDetailPage.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteProduct.mutate(product.id, {
                  onSuccess: () => navigate({ to: "/products" }),
                })
              }
            >
              {t("features.products.views.ProductDetailPage.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}
