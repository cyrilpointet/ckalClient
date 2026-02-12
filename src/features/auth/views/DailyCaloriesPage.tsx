import { Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUser } from "@/features/auth/api/useAuth"
import { useUpdateDailyCalories } from "@/features/auth/api/useUpdateDailyCalories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

const dailyCaloriesSchema = z.object({
  dailyCalories: z
    .number()
    .int("Doit être un entier")
    .min(1, "Doit être supérieur à 0"),
})

type DailyCaloriesInput = z.infer<typeof dailyCaloriesSchema>

export function DailyCaloriesPage() {
  const { data: user } = useUser()
  const updateDailyCalories = useUpdateDailyCalories()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DailyCaloriesInput>({
    resolver: zodResolver(dailyCaloriesSchema),
    defaultValues: {
      dailyCalories: user?.dailyCalories ?? 2000,
    },
  })

  const onSubmit = (data: DailyCaloriesInput) => {
    updateDailyCalories.mutate(data.dailyCalories)
  }

  return (
    <PageLayout title="Objectif calorique">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="dailyCalories">Calories par jour (kcal)</Label>
              <Input
                id="dailyCalories"
                type="number"
                min={1}
                step={1}
                {...register("dailyCalories", { valueAsNumber: true })}
              />
              {errors.dailyCalories && (
                <p className="text-sm text-destructive">
                  {errors.dailyCalories.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={updateDailyCalories.isPending}
            >
              {updateDailyCalories.isPending
                ? "Enregistrement..."
                : "Enregistrer"}
            </Button>
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Retour à l'accueil
            </Link>
          </CardFooter>
        </form>
    </PageLayout>
  )
}
