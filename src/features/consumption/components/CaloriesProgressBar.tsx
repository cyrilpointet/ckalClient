import { cn } from "@/lib/utils"

interface CaloriesProgressBarProps {
  value: number
  max: number
  className?: string
}

const WARNING_PERCENT = 80

export function CaloriesProgressBar({ value, max, className }: CaloriesProgressBarProps) {
  const isOver = value > max
  const percent = Math.min((value / max) * 100, 100)

  return (
    <div className={cn("h-2 w-full rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all",
          isOver ? "bg-destructive" : percent >= WARNING_PERCENT ? "bg-chart-5" : "bg-primary",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
