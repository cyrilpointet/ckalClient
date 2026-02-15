import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import i18n from "@/i18n/i18n"
import { useCreateWeight } from "@/features/account/api/useCreateWeight"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const weightRequiredMessage = i18n.t(
  "features.auth.components.AddWeightDialog.weightRequired",
)

const addWeightSchema = z.object({
  value: z
    .number({ error: weightRequiredMessage })
    .positive(weightRequiredMessage),
})

type AddWeightForm = z.infer<typeof addWeightSchema>

interface AddWeightDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddWeightDialog({ open, onOpenChange }: AddWeightDialogProps) {
  const { t } = useTranslation()
  const createWeight = useCreateWeight()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddWeightForm>({
    resolver: zodResolver(addWeightSchema),
  })

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset()
    }
    onOpenChange(value)
  }

  if (open && !selectedDate) {
    setSelectedDate(new Date())
  }
  if (!open && selectedDate) {
    setSelectedDate(undefined)
  }

  const onSubmit = (data: AddWeightForm) => {
    if (!selectedDate) return
    createWeight.mutate(
      {
        date: format(selectedDate, "yyyy-MM-dd"),
        value: data.value,
      },
      {
        onSuccess: () => handleOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("features.auth.components.AddWeightDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("features.auth.components.AddWeightDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 pb-4">
            <Popover
              open={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP", { locale: fr })
                    : t("features.auth.components.AddWeightDialog.pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d)
                    setIsDatePickerOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
            <div className="space-y-2">
              <Label htmlFor="weight">
                {t("features.auth.components.AddWeightDialog.weight")}
              </Label>
              <Input
                id="weight"
                type="number"
                step="any"
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && (
                <p className="text-sm text-destructive">
                  {errors.value.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t("features.auth.components.AddWeightDialog.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!selectedDate || createWeight.isPending}
            >
              {createWeight.isPending
                ? t("features.auth.components.AddWeightDialog.adding")
                : t("features.auth.components.AddWeightDialog.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
