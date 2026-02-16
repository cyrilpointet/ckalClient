import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  format,
  startOfWeek, endOfWeek, subWeeks,
  startOfMonth, endOfMonth, subMonths,
  startOfQuarter, endOfQuarter, subQuarters,
} from "date-fns"
import { fr } from "date-fns/locale"
import { ComposedChart, Line, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useUser } from "@/features/account/api/useAuth"
import { useLatestWeight } from "@/features/account/api/useLatestWeight"
import { useWeightHistory } from "@/features/account/api/useWeightHistory"
import { useDailyCalories } from "@/features/consumption/api/useDailyCalories"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import analyticsImage from "@/assets/analytics.png"

export function WeightTracker() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { data: latestWeight } = useLatestWeight()
  const [chartRange, setChartRange] = useState<"week" | "month" | "quarter">("month")
  const [chartOffset, setChartOffset] = useState(0)
  const [showCalories, setShowCalories] = useState(false)

  const now = new Date()
  let startDate: Date
  let endDate: Date

  if (chartRange === "week") {
    const ref = subWeeks(now, chartOffset)
    startDate = startOfWeek(ref, { weekStartsOn: 1 })
    endDate = endOfWeek(ref, { weekStartsOn: 1 })
  } else if (chartRange === "month") {
    const ref = subMonths(now, chartOffset)
    startDate = startOfMonth(ref)
    endDate = endOfMonth(ref)
  } else {
    const ref = subQuarters(now, chartOffset)
    startDate = startOfQuarter(ref)
    endDate = endOfQuarter(ref)
  }

  const fromStr = format(startDate, "yyyy-MM-dd")
  const toStr = format(endDate, "yyyy-MM-dd")

  const { data: weightHistory } = useWeightHistory(fromStr, toStr)
  const { data: dailyCalories } = useDailyCalories(fromStr, toStr)

  const calorieLimit = user?.dailyCalories ?? null

  const chartData = (() => {
    const byDate = new Map<string, { date: string; weight?: number; kcal?: number; overLimit?: boolean }>()

    for (const w of weightHistory ?? []) {
      const key = w.date.slice(0, 10)
      const label = format(new Date(w.date), "dd/MM", { locale: fr })
      byDate.set(key, { ...byDate.get(key), date: label, weight: w.value })
    }

    if (showCalories) {
      for (const c of dailyCalories ?? []) {
        const label = format(new Date(c.date), "dd/MM", { locale: fr })
        const overLimit = calorieLimit != null && c.kcal > calorieLimit
        byDate.set(c.date, { ...byDate.get(c.date), date: label, kcal: c.kcal, overLimit })
      }
    }

    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
  })()

  const periodLabel = `${format(startDate, "dd/MM", { locale: fr })} - ${format(endDate, "dd/MM", { locale: fr })}`

  return (
    <div>
      <p className="font-bold mb-2">{t("features.auth.components.WeightTracker.weightHeading")}</p>
      {latestWeight ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {t("features.auth.components.WeightTracker.lastWeight", {
              value: latestWeight.value,
              date: format(new Date(latestWeight.date), "PPP", { locale: fr }),
            })}
          </p>
          <div className="flex gap-2 mb-3">
            <Button
              variant={chartRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => { setChartRange("week"); setChartOffset(0) }}
            >
              {t("features.auth.components.WeightTracker.week")}
            </Button>
            <Button
              variant={chartRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => { setChartRange("month"); setChartOffset(0) }}
            >
              {t("features.auth.components.WeightTracker.month")}
            </Button>
            <Button
              variant={chartRange === "quarter" ? "default" : "outline"}
              size="sm"
              onClick={() => { setChartRange("quarter"); setChartOffset(0) }}
            >
              {t("features.auth.components.WeightTracker.quarter")}
            </Button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChartOffset((o) => o + 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{periodLabel}</span>
            <Button
              variant="ghost"
              size="icon"
              disabled={chartOffset === 0}
              onClick={() => setChartOffset((o) => o - 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="weight"
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={{ fontSize: 12 }}
                unit=" kg"
              />
              {showCalories && (
                <YAxis
                  yAxisId="calories"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  unit=" kcal"
                />
              )}
              <Tooltip />
              {showCalories && calorieLimit && (
                <ReferenceLine
                  yAxisId="calories"
                  y={calorieLimit}
                  stroke="var(--destructive)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              )}
              {showCalories && (
                <Bar
                  yAxisId="calories"
                  dataKey="kcal"
                  opacity={0.3}
                  name={t("features.auth.components.WeightTracker.kcal")}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.overLimit ? "var(--destructive)" : "var(--muted-foreground)"}
                    />
                  ))}
                </Bar>
              )}
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name={t("features.auth.components.WeightTracker.weightKg")}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 mt-3">
            <Checkbox
              id="showCalories"
              checked={showCalories}
              onCheckedChange={(checked) => setShowCalories(checked === true)}
            />
            <Label htmlFor="showCalories" className="text-sm cursor-pointer">
              {t("features.auth.components.WeightTracker.showCalories")}
            </Label>
          </div>
        </div>
      ) : (
        <div>
          <img
            src={analyticsImage}
            alt="Empty"
            className="mx-auto mb-4 h-30 w-30"
          />
          <p className="text-center">{t("features.auth.components.WeightTracker.noWeight")}</p>
        </div>
      )}
    </div>
  )
}
