import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import i18n from "@/i18n/i18n"
import { useCreateConsumedProduct } from "@/features/consumption/api/useCreateConsumedProduct"
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

const quantityRequiredMessage = i18n.t(
  "features.products.components.AddConsumptionDialog.quantityRequired",
)

const addConsumptionSchema = z.object({
  quantity: z
    .number({ error: quantityRequiredMessage })
    .int(quantityRequiredMessage)
    .min(1, quantityRequiredMessage),
})

type AddConsumptionForm = z.infer<typeof addConsumptionSchema>

interface AddConsumptionDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddConsumptionDialog({
  productId,
  open,
  onOpenChange,
}: AddConsumptionDialogProps) {
  const { t } = useTranslation()
  const createConsumedProduct = useCreateConsumedProduct()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddConsumptionForm>({
    resolver: zodResolver(addConsumptionSchema),
    defaultValues: { quantity: 1 },
  })

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset()
      setSelectedDate(undefined)
    } else {
      setSelectedDate(new Date())
    }
    onOpenChange(value)
  }

  const onSubmit = (data: AddConsumptionForm) => {
    if (!selectedDate) return
    createConsumedProduct.mutate({
      productId,
      consumedAt: format(selectedDate, "yyyy-MM-dd"),
      quantity: data.quantity,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "features.products.components.AddConsumptionDialog.addToConsumption",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "features.products.components.AddConsumptionDialog.chooseDate",
            )}
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
                    : t(
                        "features.products.components.AddConsumptionDialog.pickDate",
                      )}
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
              <Label htmlFor="quantity">
                {t(
                  "features.products.components.AddConsumptionDialog.quantity",
                )}
              </Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
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
              {t(
                "features.products.components.AddConsumptionDialog.cancel",
              )}
            </Button>
            <Button
              type="submit"
              disabled={!selectedDate || createConsumedProduct.isPending}
            >
              {createConsumedProduct.isPending
                ? t(
                    "features.products.components.AddConsumptionDialog.adding",
                  )
                : t(
                    "features.products.components.AddConsumptionDialog.confirm",
                  )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
