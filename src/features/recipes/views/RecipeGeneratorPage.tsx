import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageLayout } from "@/components/PageLayout"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGenerateRecipe } from "@/features/recipes/api/useGenerateRecipe"
import { useUser } from "@/features/auth/api/useAuth"

const recipeGeneratorSchema = z.object({
  description: z.string(),
  ingredients: z.string(),
  maxKcal: z.string(),
})

type RecipeGeneratorForm = z.infer<typeof recipeGeneratorSchema>

export function RecipeGeneratorPage() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const generateRecipe = useGenerateRecipe()

  const {
    register,
    handleSubmit,
  } = useForm<RecipeGeneratorForm>({
    resolver: zodResolver(recipeGeneratorSchema),
    defaultValues: {
      description: "",
      ingredients: "",
      maxKcal: user?.dailyCalories?.toString() ?? "",
    },
  })

  const onSubmit = (data: RecipeGeneratorForm) => {
    const ingredients = data.ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    generateRecipe.mutate({
      description: data.description || undefined,
      ingredients: ingredients.length > 0 ? ingredients : undefined,
      maxKcal: data.maxKcal ? Number(data.maxKcal) : undefined,
    })
  }

  return (
    <PageLayout
      title={t("features.recipes.views.RecipeGeneratorPage.title")}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="description">
              {t(
                "features.recipes.views.RecipeGeneratorPage.description",
              )}
            </Label>
            <Textarea
              id="description"
              placeholder={t(
                "features.recipes.views.RecipeGeneratorPage.descriptionPlaceholder",
              )}
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">
              {t(
                "features.recipes.views.RecipeGeneratorPage.ingredients",
              )}
            </Label>
            <Input
              id="ingredients"
              placeholder={t(
                "features.recipes.views.RecipeGeneratorPage.ingredientsPlaceholder",
              )}
              {...register("ingredients")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxKcal">
              {t(
                "features.recipes.views.RecipeGeneratorPage.maxKcal",
              )}
            </Label>
            <Input
              id="maxKcal"
              type="number"
              placeholder={t(
                "features.recipes.views.RecipeGeneratorPage.maxKcalPlaceholder",
              )}
              {...register("maxKcal")}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={generateRecipe.isPending}
          >
            {generateRecipe.isPending
              ? t(
                  "features.recipes.views.RecipeGeneratorPage.submitting",
                )
              : t(
                  "features.recipes.views.RecipeGeneratorPage.submit",
                )}
          </Button>
        </CardFooter>
      </form>
    </PageLayout>
  )
}
