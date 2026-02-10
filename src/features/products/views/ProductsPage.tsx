import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useProducts } from "@/features/products/api/useProducts"
import { useDeleteProduct } from "@/features/products/api/useDeleteProduct"
import { Button } from "@/components/ui/button"
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
import { Pencil, Trash2 } from "lucide-react"

export function ProductsPage() {
  const navigate = useNavigate()
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  return (
    <PageLayout title="Mes produits">
      <CardContent className="flex flex-col gap-4">
        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            Chargement...
          </p>
        )}

        {products && products.length > 0 && (
          <ul className="divide-y">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/products/$productId",
                      params: { productId: product.id },
                    })
                  }
                  className="flex flex-1 items-center justify-between rounded px-2 py-2 text-left transition-colors hover:bg-accent"
                >
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-medium">
                    {product.kcal} kcal
                  </span>
                </button>
                <Link
                  to="/products/$productId/edit"
                  params={{ productId: product.id }}
                  className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setProductToDelete(product.id)}
                  className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {products && products.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground">
            Aucun produit
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/products/new" className="w-full">
          <Button className="w-full">Ajouter un produit</Button>
        </Link>
      </CardFooter>
      <AlertDialog
        open={productToDelete !== null}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Voulez-vous vraiment supprimer ce
              produit ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDelete) {
                  deleteProduct.mutate(productToDelete)
                  setProductToDelete(null)
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
