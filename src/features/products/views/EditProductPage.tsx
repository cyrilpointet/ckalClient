import { Link } from "@tanstack/react-router"
import { useProduct } from "@/features/products/api/useProduct"
import { useUpdateProduct } from "@/features/products/api/useUpdateProduct"
import { ProductForm } from "@/features/products/components/ProductForm"
import { PageLayout } from "@/components/PageLayout"

export function EditProductPage({ productId }: { productId: string }) {
  const { data: product, isLoading } = useProduct(productId)
  const updateProduct = useUpdateProduct(productId)

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
    <ProductForm
      title="Modifier le produit"
      submitLabel="Sauvegarder"
      submittingLabel="Sauvegarde..."
      isPending={updateProduct.isPending}
      onSubmit={(payload) => updateProduct.mutate(payload)}
      defaultValues={{
        name: product.name,
        description: product.description,
        kcal: product.kcal,
      }}
      footer={
        <Link
          to="/products/$productId"
          params={{ productId }}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Annuler
        </Link>
      }
    />
  )
}
