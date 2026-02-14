import { type ReactNode, useState } from "react"
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
  const kcal = watch("kcal")
  const canEstimate = (!!name || !!description?.trim()) && !(kcal > 0)

  const estimateCalories = async () => {
    setIsEstimating(true)
    try {
      const meal = [name, description].filter(Boolean).join(" ")
      const { data } = await apiClient.post<{ total_calories: number }>(
        "/llm/kcalculator",
        { meal },
      )
      setValue("kcal", data.total_calories)
      toast.success("Estimation calorique terminée")
    } catch {
      toast.error("L'estimation calorique a échoué")
    } finally {
      setIsEstimating(false)
    }
  }

  const handleFormSubmit = (data: CreateProductInput) => {
    onSubmit({
      name: data.name,
      description: data.description?.trim() || null,
      kcal: data.kcal,
      isRecipe: true,
    })
  }

  return (
    <PageLayout title={title}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Nom du produit"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description (optionnel)"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
              {canEstimate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isEstimating}
                  onClick={estimateCalories}
                >
                  {isEstimating ? (
                    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="mr-2 h-4 w-4" />
                  )}
                  {isEstimating
                    ? "Estimation en cours..."
                    : "Estimation calorique"}
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kcal">Calories (kcal)</Label>
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
