import { Link } from "@tanstack/react-router"
import { useUser, useLogout } from "@/features/auth/api/useAuth"
import { useTodayProducts } from "@/features/products/api/useTodayProducts"
import { useDeleteProduct } from "@/features/products/api/useDeleteProduct"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { X } from "lucide-react"

export function HomePage() {
  const { data: user } = useUser()
  const logout = useLogout()
  const { data: products, isLoading } = useTodayProducts()
  const deleteProduct = useDeleteProduct()

  const totalKcal = products?.reduce((sum, p) => sum + p.kcal, 0) ?? 0
  const dailyCalories = user?.dailyCalories ?? null
  const isOver = dailyCalories !== null && totalKcal > dailyCalories

  return (
    <PageLayout title={`Bienvenue${user?.username ? `, ${user.username}` : ""} !`}>
        <CardContent className="flex flex-col gap-6">
          <div className="text-center">
            <p
              className={cn(
                "text-3xl font-bold",
                isOver && "text-destructive",
              )}
            >
              {totalKcal}
              {dailyCalories !== null && (
                <span className="text-lg font-normal text-muted-foreground">
                  {" "}
                  / {dailyCalories} kcal
                </span>
              )}
              {dailyCalories === null && (
                <span className="text-lg font-normal text-muted-foreground">
                  {" "}
                  kcal
                </span>
              )}
            </p>
            {isOver && (
              <p className="mt-1 text-sm text-destructive">
                Objectif calorique dépassé
              </p>
            )}
          </div>

          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Chargement...
            </p>
          )}

          {products && products.length > 0 && (
            <ul className="divide-y">
              {products.map((product) => (
                <li key={product.id} className="flex items-center gap-1">
                  <Link
                    to="/products/$productId"
                    params={{ productId: product.id }}
                    className="flex flex-1 items-center justify-between py-2 hover:bg-accent rounded px-2 -mx-2 transition-colors"
                  >
                    <span className="text-sm">{product.name}</span>
                    <span className="text-sm font-medium">
                      {product.kcal} kcal
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProduct.mutate(product.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {products && products.length === 0 && !isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Aucun produit consommé aujourd'hui
            </p>
          )}

          <div className="flex flex-col items-center gap-4">
            <Link to="/products/new">
              <Button>Ajouter un produit</Button>
            </Link>
            <Link to="/daily-calories">
              <Button variant="outline">Objectif calorique</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Déconnexion..." : "Déconnexion"}
            </Button>
          </div>
        </CardContent>
    </PageLayout>
  )
}
