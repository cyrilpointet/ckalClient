import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useCreateProduct } from "@/features/products/api/useCreateProduct"
import {
  createProductSchema,
  type CreateProductInput,
} from "@/features/products/types"
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface NewProductSearch {
  name?: string
  description?: string
  kcal?: number
}

export const Route = createFileRoute("/products/new")({
  validateSearch: (search: Record<string, unknown>): NewProductSearch => ({
    name: typeof search.name === "string" ? search.name : undefined,
    description:
      typeof search.description === "string" ? search.description : undefined,
    kcal: typeof search.kcal === "number" ? search.kcal : undefined,
  }),
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: NewProductPage,
})

function NewProductPage() {
  const search = Route.useSearch()
  const createProduct = useCreateProduct()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: search.name ?? "",
      description: search.description ?? null,
      kcal: search.kcal ?? 0,
      consumedAt: new Date(),
    },
  })

  const onSubmit = (data: CreateProductInput) => {
    createProduct.mutate({
      name: data.name,
      description: data.description?.trim() || null,
      kcal: data.kcal,
      consumedAt: data.consumedAt.toISOString(),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Nouveau produit
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                min={0}
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
              disabled={createProduct.isPending}
            >
              {createProduct.isPending ? "Création..." : "Créer le produit"}
            </Button>
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Retour à l'accueil
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
