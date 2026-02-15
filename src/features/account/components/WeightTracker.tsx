import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  format,
  startOfWeek, endOfWeek, subWeeks,
  startOfMonth, endOfMonth, subMonths,
  startOfQuarter, endOfQuarter, subQuarters,
} from "date-fns"
import { fr } from "date-fns/locale"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLatestWeight } from "@/features/account/api/useLatestWeight"
import { useWeightHistory } from "@/features/account/api/useWeightHistory"
import { Button } from "@/components/ui/button"

import analyticsImage from "@/assets/analytics.png"

export function WeightTracker() {
  const { t } = useTranslation()
  const { data: latestWeight } = useLatestWeight()
  const [chartRange, setChartRange] = useState<"week" | "month" | "quarter">("month")
  const [chartOffset, setChartOffset] = useState(0)

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

  const { data: weightHistory } = useWeightHistory(
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd"),
  )

  const chartData = (weightHistory ?? []).map((w) => ({
    date: format(new Date(w.date), "dd/MM", { locale: fr }),
    value: w.value,
  }))

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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12 }} unit=" kg" />
              <Tooltip formatter={(value) => [`${value} kg`, t("features.auth.components.WeightTracker.weightKg")]} />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
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
