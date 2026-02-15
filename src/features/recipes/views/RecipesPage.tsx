import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "@tanstack/react-router"
import { useRecipes } from "@/features/recipes/api/useRecipes"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { Sparkles } from "lucide-react"

import recipeBookImage from "@/assets/recipe-book.png"

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
    <PageLayout title={t("features.recipes.views.RecipesPage.title")}>
      <CardContent className="flex flex-col gap-4">
        <Input
          placeholder={t("features.recipes.views.RecipesPage.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            {t("features.recipes.views.RecipesPage.loading")}
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
                  ? t("features.recipes.views.RecipesPage.loadingMore")
                  : t("features.recipes.views.RecipesPage.loadMore")}
              </Button>
            )}
          </>
        )}

        {allRecipes.length === 0 && !isLoading && (
          <div>
            <img
              src={recipeBookImage}
              alt="Empty"
              className="mx-auto mb-4 h-48 w-48"
            />
            <p className="text-center text-sm text-muted-foreground">
              {t("features.recipes.views.RecipesPage.empty")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Link to="/recipe-generator" className="w-full">
          <Button variant="secondary" className="w-full">
            <Sparkles className="h-4 w-4" />
            {t("features.recipes.views.RecipesPage.generate")}
          </Button>
        </Link>
        <Link to="/products/new" className="w-full">
          <Button className="w-full">
            {t("features.recipes.views.RecipesPage.add")}
          </Button>
        </Link>
      </CardFooter>
    </PageLayout>
  )
}
