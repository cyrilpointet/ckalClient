import { type ReactNode, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"
import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductPayload,
} from "@/features/products/types"
import apiClient from "@/lib/axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  })

  const name = watch("name")
  const description = watch("description")
  const canEstimate = !!name || !!description?.trim()

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
      consumedAt: data.consumedAt.toISOString(),
    })
  }

  return (
    <PageLayout title={title}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4">
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
              <Label>Date de consommation</Label>
              <Controller
                control={control}
                name="consumedAt"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP", { locale: fr })
                          : "Choisir une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => date && field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.consumedAt && (
                <p className="text-sm text-destructive">
                  {errors.consumedAt.message}
                </p>
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
