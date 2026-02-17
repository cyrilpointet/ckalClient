import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import { useProduct } from "@/features/products/api/useProduct"
import { useDeleteProduct } from "@/features/products/api/useDeleteProduct"
import { Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { ProductViewer } from "@/features/products/components/ProductViewer"
import { AddConsumptionDialog } from "@/features/products/components/AddConsumptionDialog"

export function ProductDetailPage({ productId }: { productId: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(productId)
  const deleteProduct = useDeleteProduct()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
      <Button
        size="icon"
        variant="outline"
        onClick={() => setIsAddOpen(true)}
        className="fixed top-1.5 right-4 z-50 size-9 rounded-full md:hidden"
      >
        <Plus />
      </Button>
      <CardContent className="flex flex-col gap-4">
        {product.isRecipe && (
          <p className="flex items-center justify-center gap-1 text-center text-sm italic text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            {t("features.products.views.ProductDetailPage.personalDish")}
          </p>
        )}
        <ProductViewer
          name={product.name}
          description={product.description}
          kcal={product.kcal}
          protein={product.protein}
          carbohydrate={product.carbohydrate}
          lipid={product.lipid}
          showName={false}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {product.isRecipe && (
          <div className="grid grid-cols-2 gap-2 w-full">
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
                protein: product.protein ?? undefined,
                carbohydrate: product.carbohydrate ?? undefined,
                lipid: product.lipid ?? undefined,
              }}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                {t("features.products.views.ProductDetailPage.duplicate")}
              </Button>
            </Link>
          </div>
        )}
        <Button
          className="w-full"
          onClick={() => setIsAddOpen(true)}
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

      <AddConsumptionDialog
        productId={product.id}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("features.products.views.ProductDetailPage.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("features.products.views.ProductDetailPage.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2">
            <AlertDialogCancel>{t("features.products.views.ProductDetailPage.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteProduct.mutate(product.id, {
                  onSuccess: () => navigate({ to: "/products" }),
                })
              }
              variant="destructive"
            >
              {t("features.products.views.ProductDetailPage.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}
