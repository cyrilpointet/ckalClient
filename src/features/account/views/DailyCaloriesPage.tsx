import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import i18n from "@/i18n/i18n"
import { useUser } from "@/features/account/api/useAuth"
import { useUpdateDailyCalories } from "@/features/account/api/useUpdateDailyCalories"
import { useLatestWeight } from "@/features/account/api/useLatestWeight"
import { AddWeightDialog } from "@/features/account/components/AddWeightDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

import analyticsImage from "@/assets/analytics.png"

const dailyCaloriesSchema = z.object({
  dailyCalories: z
    .number()
    .int(i18n.t("features.auth.views.DailyCaloriesPage.mustBeInteger"))
    .min(1, i18n.t("features.auth.views.DailyCaloriesPage.mustBePositive")),
})

type DailyCaloriesInput = z.infer<typeof dailyCaloriesSchema>

export function DailyCaloriesPage() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const updateDailyCalories = useUpdateDailyCalories()
  const { data: latestWeight } = useLatestWeight()
  const [isWeightOpen, setIsWeightOpen] = useState(false)

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
    <PageLayout title={t("features.auth.views.DailyCaloriesPage.title")}>
      <CardContent className="space-y-4 pb-6">
        <div>
          <p className="font-bold mb-2">{t("features.auth.views.DailyCaloriesPage.weightHeading")}</p>
          {latestWeight ? (
            <p className="text-sm text-muted-foreground">
              {t("features.auth.views.DailyCaloriesPage.lastWeight", {
                value: latestWeight.value,
                date: format(new Date(latestWeight.date), "PPP", { locale: fr }),
              })}
            </p>
          ) : (
            <div>
              <img
                src={analyticsImage}
                alt="Empty"
                className="mx-auto mb-4 h-30 w-30"
              />
              <p className="text-center">{t("features.auth.views.DailyCaloriesPage.noWeight")}</p>
            </div>)}
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsWeightOpen(true)}
        >
          {t("features.auth.views.DailyCaloriesPage.addWeight")}
        </Button>
      </CardContent>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <div>
            <p className="font-bold mb-2">{t("features.auth.views.DailyCaloriesPage.heading")}</p>
            <div className="space-y-2 grid grid-cols-2 items-center">
              <Label htmlFor="dailyCalories" className="w-full">{t("features.auth.views.DailyCaloriesPage.label")}</Label>
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={updateDailyCalories.isPending}
          >
            {updateDailyCalories.isPending
              ? t("features.auth.views.DailyCaloriesPage.submitting")
              : t("features.auth.views.DailyCaloriesPage.submit")}
          </Button>
        </CardFooter>
      </form>

      <AddWeightDialog open={isWeightOpen} onOpenChange={setIsWeightOpen} />
    </PageLayout>
  )
}
