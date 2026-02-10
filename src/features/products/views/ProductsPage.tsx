import { Link, useNavigate } from "@tanstack/react-router"
import { useProducts } from "@/features/products/api/useProducts"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"

export function ProductsPage() {
  const navigate = useNavigate()
  const { data: products, isLoading } = useProducts()

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
    </PageLayout>
  )
}
