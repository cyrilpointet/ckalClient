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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGenerateRecipe } from "@/features/recipes/api/useGenerateRecipe"
import { useCreateProduct } from "@/features/products/api/useCreateProduct"
import { Loader2 } from "lucide-react"
import { useUser } from "@/features/account/api/useAuth"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { ProductViewer } from "@/features/products/components/ProductViewer"

import chefImage from "@/assets/chef.png"

const recipeGeneratorSchema = z.object({
  description: z.string(),
  ingredients: z.string(),
  maxKcal: z.union([
    z.number().int().min(1),
    z.nan().transform(() => undefined),
  ]).optional(),
})

type RecipeGeneratorForm = z.infer<typeof recipeGeneratorSchema>

export function RecipeGeneratorPage() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { data: consumedProducts } = useConsumedProducts(new Date())
  const generateRecipe = useGenerateRecipe()
  const createProduct = useCreateProduct()

  const totalKcal =
    Math.round(consumedProducts?.reduce((sum, p) => sum + p.product.kcal * p.quantity, 0) ?? 0)
  const remainingKcal = user?.dailyCalories != null
    ? Math.max(0, user.dailyCalories - totalKcal)
    : undefined

  const {
    register,
    handleSubmit,
  } = useForm<RecipeGeneratorForm>({
    resolver: zodResolver(recipeGeneratorSchema),
    defaultValues: {
      description: "",
      ingredients: "",
      maxKcal: remainingKcal,
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
      maxKcal: data.maxKcal,
    })
  }

  const handleConfirm = () => {
    if (!generateRecipe.data) return
    createProduct.mutate({
      name: generateRecipe.data.name,
      description: generateRecipe.data.description || null,
      kcal: generateRecipe.data.total_calories,
      isRecipe: true,
    })
  }

  return (
    <PageLayout
      title={t("features.recipes.views.RecipeGeneratorPage.title")}
    >

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <p className="text-center text-sm text-muted-foreground">
            {t("features.recipes.views.RecipeGeneratorPage.subtitle")}
          </p>
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
              {...register("maxKcal", { valueAsNumber: true })}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={generateRecipe.isPending}
          >
            {generateRecipe.isPending && <Loader2 className="animate-spin" />}
            {generateRecipe.isPending
              ? t(
                  "features.recipes.views.RecipeGeneratorPage.submitting",
                )
              : t(
                  "features.recipes.views.RecipeGeneratorPage.submit",
                )}
          </Button>
             <img
              src={chefImage}
              alt="Empty"
              className="mx-auto mb-4 h-48 w-48"
            />
        </CardFooter>
      </form>

      <Dialog
        open={!!generateRecipe.data}
        onOpenChange={(open) => {
          if (!open) generateRecipe.reset()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("features.recipes.views.RecipeGeneratorPage.confirmTitle")}
            </DialogTitle>
          </DialogHeader>
          {generateRecipe.data && (
            <ProductViewer
              name={generateRecipe.data.name}
              description={generateRecipe.data.description}
              kcal={generateRecipe.data.total_calories}
            />
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => generateRecipe.reset()}
            >
              {t("features.recipes.views.RecipeGeneratorPage.cancel")}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={createProduct.isPending}
            >
              {createProduct.isPending
                ? t("features.recipes.views.RecipeGeneratorPage.confirming")
                : t("features.recipes.views.RecipeGeneratorPage.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
