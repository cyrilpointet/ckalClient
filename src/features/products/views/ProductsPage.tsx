import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useProducts } from "@/features/products/api/useProducts"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BarcodeScanner } from "../components/BarcodeScanner"
import { LoaderCircleIcon, Scan } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/axios"

interface OffProduct {
  name: string
  description: string
  weight: number
  kcal: number
}

export function ProductsPage() {
  const navigate = useNavigate()
  const { data: products, isLoading } = useProducts()
  const [isScanOpen, setIsScanOpen] = useState(false)

  const scanMutation = useMutation({
    mutationFn: (code: string) =>
      apiClient.get<OffProduct>(`/off/${code}`).then((r) => r.data),
    onSuccess: (data) => {
      navigate({
        to: "/products/new",
        search: {
          name: data.name,
          description: data.description,
          kcal: data.kcal,
        },
      })
    },
    onError: () => {
      toast.error("Impossible de récupérer les informations du produit")
    },
  })

  const handleScan = (code: string) => {
    setIsScanOpen(false)
    scanMutation.mutate(code)
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
            <Button variant="outline" disabled={scanMutation.isPending}>
              {scanMutation.isPending ? (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Scan className="mr-2 h-4 w-4" />
              )}
              {scanMutation.isPending ? "Recherche..." : "Scanner un produit"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scanner un produit</DialogTitle>
            </DialogHeader>
            <BarcodeScanner onScan={handleScan} />
          </DialogContent>
        </Dialog>

        <Link to="/products/new" className="w-full">
          <Button className="w-full" disabled={scanMutation.isPending}>Ajouter un produit</Button>
        </Link>
      </CardFooter>
    </PageLayout>
  )
}
