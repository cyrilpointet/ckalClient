import { type ReactNode, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"
import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductPayload,
} from "@/features/products/types"
import apiClient from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

interface ProductFormProps {
  title: string
  submitLabel: string
  submittingLabel: string
  isPending: boolean
  onSubmit: (payload: CreateProductPayload) => void
  defaultValues: CreateProductInput
  footer: ReactNode
}

export function ProductForm({
  title,
  submitLabel,
  submittingLabel,
  isPending,
  onSubmit,
  defaultValues,
  footer,
}: ProductFormProps) {
  const { t } = useTranslation()
  const [isEstimating, setIsEstimating] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  })

  const name = watch("name")
  const description = watch("description")
  const canEstimate = (!!name || !!description?.trim())

  const estimateCalories = async () => {
    setIsEstimating(true)
    try {
      const meal = [name, description].filter(Boolean).join(" ")
      const { data } = await apiClient.post<{ total_calories: number; protein: number | null; carbohydrate: number | null; lipid: number | null }>(
        "/ai/kcalculator",
        { meal },
      )
      setValue("kcal", data.total_calories)
      setValue("protein", data.protein)
      setValue("carbohydrate", data.carbohydrate)
      setValue("lipid", data.lipid)
      toast.success(t("features.products.components.ProductForm.estimateSuccess"))
    } catch {
      toast.error(t("features.products.components.ProductForm.estimateError"))
    } finally {
      setIsEstimating(false)
    }
  }

  const handleFormSubmit = (data: CreateProductInput) => {
    onSubmit({
      name: data.name,
      description: data.description?.trim() || null,
      kcal: data.kcal,
      protein: data.protein,
      carbohydrate: data.carbohydrate,
      lipid: data.lipid,
      isRecipe: true,
    })
  }

  return (
    <PageLayout title={title}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t("features.products.components.ProductForm.name")}</Label>
            <Input
              id="name"
              placeholder={t("features.products.components.ProductForm.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("features.products.components.ProductForm.description")}</Label>
            <Textarea
              id="description"
              placeholder={t("features.products.components.ProductForm.descriptionPlaceholder")}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}

          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-2 items-end">
            <div>
              <Label htmlFor="kcal">{t("features.products.components.ProductForm.caloriesLabel")}</Label>
              <Input
                id="kcal"
                type="number"
                step={1}
                {...register("kcal", { valueAsNumber: true })}
              />
              {errors.kcal && (
                <p className="text-sm text-destructive">
                  {errors.kcal.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isEstimating || !canEstimate}
              onClick={estimateCalories}
              className="border border-chart-4"
            >
              {isEstimating ? (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="fill-chart-4 text-chart-4 mr-2 h-4 w-4" />
              )}
              {isEstimating
                ? t("features.products.components.ProductForm.estimating")
                : t("features.products.components.ProductForm.estimate")}
            </Button>
          </div>
          <div className="space-y-2">
            <Label>{t("features.products.components.ProductForm.macros")}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder={t("features.products.components.ProductForm.protein")}
                {...register("protein", { setValueAs: (v: string) => (v === "" ? null : Number(v)) })}
              />
              <Input
                id="carbohydrate"
                type="number"
                step="0.1"
                placeholder={t("features.products.components.ProductForm.carbohydrate")}
                {...register("carbohydrate", { setValueAs: (v: string) => (v === "" ? null : Number(v)) })}
              />
              <Input
                id="lipid"
                type="number"
                step="0.1"
                placeholder={t("features.products.components.ProductForm.lipid")}
                {...register("lipid", { setValueAs: (v: string) => (v === "" ? null : Number(v)) })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? submittingLabel : submitLabel}
          </Button>
          {footer}
        </CardFooter>
      </form>
    </PageLayout>
  )
}
