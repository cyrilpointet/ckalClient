import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useProducts } from "@/features/products/api/useProducts"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarcodeScanner } from "../components/BarcodeScanner"
import { Scan } from "lucide-react"

export function ProductsPage() {
  const navigate = useNavigate()
  const { data: products, isLoading } = useProducts()
  const [isScanOpen, setIsScanOpen] = useState(false)

  const handleScan = (code: string) => {
    setIsScanOpen(false)
    console.log("Code détecté :", code)
    // Ici : appel à ton API AdonisJS (ex: mutation.mutate(code))
  }

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

      <CardFooter className="gap-2">
        <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><Scan className="mr-2 h-4 w-4" />Scanner un produit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scanner un produit</DialogTitle>
            </DialogHeader>
            <BarcodeScanner onScan={handleScan} />
          </DialogContent>
        </Dialog>

        <Link to="/products/new" className="w-full">
          <Button className="w-full">Ajouter un produit</Button>
        </Link>
      </CardFooter>
    </PageLayout>
  )
}
