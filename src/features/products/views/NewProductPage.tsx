import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const createProduct = useCreateProduct()

  return (
    <ProductForm
      title={t("features.products.views.NewProductPage.title")}
      submitLabel={t("features.products.views.NewProductPage.submit")}
      submittingLabel={t("features.products.views.NewProductPage.submitting")}
      isPending={createProduct.isPending}
      onSubmit={(payload) => createProduct.mutate(payload)}
      defaultValues={{
        name: defaultName ?? "",
        description: defaultDescription ?? null,
        kcal: defaultKcal ?? 0,
      }}
      footer={
        <Link
          to="/"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("features.products.views.NewProductPage.backToHome")}
        </Link>
      }
    />
  )
}
