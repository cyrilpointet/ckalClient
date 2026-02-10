import { createFileRoute, redirect } from "@tanstack/react-router"
import { ProductDetailPage } from "@/features/products/views/ProductDetailPage"

export const Route = createFileRoute("/products/$productId")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: ProductDetailRoute,
})

function ProductDetailRoute() {
  const { productId } = Route.useParams()
  return <ProductDetailPage productId={productId} />
}
