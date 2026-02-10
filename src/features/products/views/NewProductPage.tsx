import { Link } from "@tanstack/react-router"
import { useCreateProduct } from "@/features/products/api/useCreateProduct"
import { ProductForm } from "@/features/products/components/ProductForm"

interface NewProductPageProps {
  defaultName?: string
  defaultDescription?: string
  defaultKcal?: number
}

export function NewProductPage({
  defaultName,
  defaultDescription,
  defaultKcal,
}: NewProductPageProps) {
  const createProduct = useCreateProduct()

  return (
    <ProductForm
      title="Nouveau produit"
      submitLabel="Créer le produit"
      submittingLabel="Création..."
      isPending={createProduct.isPending}
      onSubmit={(payload) => createProduct.mutate(payload)}
      defaultValues={{
        name: defaultName ?? "",
        description: defaultDescription ?? null,
        kcal: defaultKcal ?? 0,
        consumedAt: new Date(),
      }}
      footer={
        <Link
          to="/"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Retour à l'accueil
        </Link>
      }
    />
  )
}
