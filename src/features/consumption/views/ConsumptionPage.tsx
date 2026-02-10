import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Trash2 } from "lucide-react"
import { useConsumedProducts } from "@/features/consumption/api/useConsumedProducts"
import { useDeleteConsumedProduct } from "@/features/consumption/api/useDeleteConsumedProduct"
import { useUser } from "@/features/auth/api/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function ConsumptionPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { data: user } = useUser()
  const { data: products, isLoading } = useConsumedProducts(date)
  const deleteConsumedProduct = useDeleteConsumedProduct()

  const totalKcal =
    products?.reduce((sum, p) => sum + p.product.kcal, 0) ?? 0
  const dailyCalories = user?.dailyCalories ?? null
  const isOver = dailyCalories !== null && totalKcal > dailyCalories

  return (
    <PageLayout title="Consommation">
      <CardContent className="flex flex-col gap-4">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP", { locale: fr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d)
                  setIsCalendarOpen(false)
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            Chargement...
          </p>
        )}

        {products && products.length > 0 && (
          <>
            <ul className="divide-y">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-1 text-sm"
                >
                  <Link
                    to="/products/$productId"
                    params={{ productId: product.productId }}
                    className="flex flex-1 items-center justify-between rounded px-2 py-2 transition-colors hover:bg-accent"
                  >
                    <span>{product.product.name}</span>
                    <span className="font-medium">
                      {product.product.kcal} kcal
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(product.id)}
                    className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
              <span>Total</span>
              <span>
                <span className={cn(isOver && "text-destructive")}>
                  {totalKcal}
                </span>
                {dailyCalories !== null && (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / {dailyCalories}
                  </span>
                )}{" "}
                kcal
              </span>
            </div>
          </>
        )}

        {products && products.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            Aucune consommation pour cette date
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/products" className="w-full">
          <Button className="w-full">Ajouter</Button>
        </Link>
      </CardFooter>
      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la consommation</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer cette consommation ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  deleteConsumedProduct.mutate(itemToDelete)
                  setItemToDelete(null)
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}
