import { Link, useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useProduct } from "@/features/products/api/useProduct"
import { useDeleteProduct } from "@/features/products/api/useDeleteProduct"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function ProductDetailPage({ productId }: { productId: string }) {
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(productId)
  const deleteProduct = useDeleteProduct()

  if (isLoading) {
    return (
      <PageLayout>
        <p className="text-muted-foreground">Chargement...</p>
      </PageLayout>
    )
  }

  if (!product) {
    return (
      <PageLayout>
        <p className="text-muted-foreground">Produit introuvable</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={product.name}>
        <CardContent className="flex flex-col gap-4">
          {product.description && (
            <div
              className="prose prose-sm max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Calories</span>
            <span className="font-medium">{product.kcal} kcal</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Consommé le</span>
            <span className="font-medium">
              {format(new Date(product.consumedAt), "PPP", { locale: fr })}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link
            to="/products/$productId/edit"
            params={{ productId: product.id }}
            className="w-full"
          >
            <Button variant="outline" className="w-full">
              Modifier
            </Button>
          </Link>
          <Link
            to="/products/new"
            search={{
              name: product.name,
              description: product.description ?? undefined,
              kcal: product.kcal,
            }}
            className="w-full"
          >
            <Button variant="outline" className="w-full">
              Dupliquer
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full"
            disabled={deleteProduct.isPending}
            onClick={() =>
              deleteProduct.mutate(product.id, {
                onSuccess: () => navigate({ to: "/" }),
              })
            }
          >
            {deleteProduct.isPending ? "Suppression..." : "Supprimer"}
          </Button>
          <Link
            to="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Retour à l'accueil
          </Link>
        </CardFooter>
    </PageLayout>
  )
}
