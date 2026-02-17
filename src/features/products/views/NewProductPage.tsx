import { useTranslation } from "react-i18next"
import { useCreateProduct } from "@/features/products/api/useCreateProduct"
import { ProductForm } from "@/features/products/components/ProductForm"

interface NewProductPageProps {
  defaultName?: string
  defaultDescription?: string
  defaultKcal?: number
  defaultProtein?: number
  defaultCarbohydrate?: number
  defaultLipid?: number
}

export function NewProductPage({
  defaultName,
  defaultDescription,
  defaultKcal,
  defaultProtein,
  defaultCarbohydrate,
  defaultLipid,
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
        protein: defaultProtein ?? null,
        carbohydrate: defaultCarbohydrate ?? null,
        lipid: defaultLipid ?? null,
      }}
      footer={null}
    />
  )
}
