import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useProducts } from "@/features/products/api/useProducts"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarcodeScanner } from "../components/BarcodeScanner"
import { LoaderCircleIcon, Scan, Star } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/axios"

interface OffProduct {
  name: string
  description: string
  weight: number
  kcal: number
}

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
  const [isScanOpen, setIsScanOpen] = useState(false)

  const scanMutation = useMutation({
    mutationFn: (code: string) =>
      apiClient.get<OffProduct>(`/off/${code}`).then((r) => r.data),
    onSuccess: (data) => {
      navigate({
        to: "/products/new",
        search: {
          name: data.name,
          description: data.description,
          kcal: data.kcal,
        },
      })
    },
    onError: () => {
      toast.error(t("features.products.views.ProductsPage.scanError"))
    },
  })

  const handleScan = (code: string) => {
    setIsScanOpen(false)
    scanMutation.mutate(code)
  }

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
                    className="flex flex-1 items-center justify-between rounded px-2 py-2 text-left transition-colors hover:bg-accent"
                  >
                    <span className="flex items-center gap-1 text-sm">
                      {product.name}
                      {product.isRecipe && <Star className="h-3 w-3 text-yellow-500" />}
                    </span>
                    <span className="text-sm font-medium">
                      {product.kcal} kcal
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {hasNextPage && (
              <Button
                variant="ghost"
                className="w-full"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? t("features.products.views.ProductsPage.loadingMore") : t("features.products.views.ProductsPage.loadMore")}
              </Button>
            )}
          </>
        )}

        {allProducts.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.products.views.ProductsPage.empty")}
          </p>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={scanMutation.isPending}>
              {scanMutation.isPending ? (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Scan className="mr-2 h-4 w-4" />
              )}
              {scanMutation.isPending ? t("features.products.views.ProductsPage.scanning") : t("features.products.views.ProductsPage.scan")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("features.products.views.ProductsPage.scan")}</DialogTitle>
            </DialogHeader>
            <BarcodeScanner onScan={handleScan} />
          </DialogContent>
        </Dialog>

        <Link to="/products/new" className="w-full">
          <Button className="w-full" disabled={scanMutation.isPending}>{t("features.products.views.ProductsPage.add")}</Button>
        </Link>
      </CardFooter>
    </PageLayout>
  )
}
