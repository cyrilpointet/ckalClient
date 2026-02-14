import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import { useRecipes } from "@/features/products/api/useRecipes"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function RecipesPage() {
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
  } = useRecipes(nameFilter)

  const allRecipes = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <PageLayout title={t("features.products.views.RecipesPage.title")}>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder={t("features.products.views.RecipesPage.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.products.views.RecipesPage.loading")}
          </p>
        )}

        {allRecipes.length > 0 && (
          <>
            <ul className="divide-y">
              {allRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/products/$productId",
                        params: { productId: recipe.id },
                      })
                    }
                    className="flex w-full items-center justify-between rounded px-2 py-2 text-left transition-colors hover:bg-accent"
                  >
                    <span className="text-sm">{recipe.name}</span>
                    <span className="text-sm font-medium">
                      {recipe.kcal} kcal
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
                {isFetchingNextPage
                  ? t("features.products.views.RecipesPage.loadingMore")
                  : t("features.products.views.RecipesPage.loadMore")}
              </Button>
            )}
          </>
        )}

        {allRecipes.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.products.views.RecipesPage.empty")}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Link to="/products/new" className="w-full">
          <Button className="w-full">
            {t("features.products.views.RecipesPage.add")}
          </Button>
        </Link>
      </CardFooter>
    </PageLayout>
  )
}
