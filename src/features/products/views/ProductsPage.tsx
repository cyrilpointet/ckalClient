import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import { useProducts } from "@/features/products/api/useProducts"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { ScanProductDialog } from "@/features/products/components/ScanProductDialog"
import { PictureProductDialog } from "@/features/products/components/PictureProductDialog"
import { Star } from "lucide-react"

import nutritionPlanImage from "@/assets/nutrition-plan.png"

export function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 400)
  const nameFilter = debouncedSearch.length >= 3 ? debouncedSearch : undefined
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProducts(nameFilter)

  const allProducts = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <PageLayout title={t("features.products.views.ProductsPage.title")}>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder={t("features.products.views.ProductsPage.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.products.views.ProductsPage.loading")}
          </p>
        )}

        {allProducts.length > 0 && (
          <>
            <ul className="divide-y">
              {allProducts.map((product) => (
                <li key={product.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/products/$productId",
                        params: { productId: product.id },
                      })
                    }
                    className="flex flex-1 items-center gap-2 rounded px-2 py-2 text-left transition-colors hover:bg-accent min-w-0"
                  >
                    <span className="flex items-center gap-1 text-sm min-w-0 flex-1">
                      <span className="truncate">{product.name}</span>
                      {product.isRecipe && <Star className="h-[1em] w-[1em] shrink-0 text-yellow-500" />}
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap ml-auto">
                      {product.kcal} kcal
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {hasNextPage && (
              <Button
                variant="outline"
                className="mx-auto"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? t("features.products.views.ProductsPage.loadingMore") : t("features.products.views.ProductsPage.loadMore")}
              </Button>
            )}
          </>
        )}

        {allProducts.length === 0 && !isLoading && (
          <div>
            <img
              src={nutritionPlanImage}
              alt="Empty"
              className="mx-auto mb-4 h-48 w-48"
            />
            <p className="text-center text-sm text-muted-foreground">
              {t("features.products.views.ProductsPage.empty")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 flex flex-col">
        <ScanProductDialog className="w-full" />
        <PictureProductDialog className="w-full" />

        <Link to="/products/new" className="w-full">
          <Button className="w-full">{t("features.products.views.ProductsPage.add")}</Button>
        </Link>
      </CardFooter>
    </PageLayout>
  )
}
