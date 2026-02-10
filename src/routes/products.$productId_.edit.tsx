import { createFileRoute, redirect } from "@tanstack/react-router"
import { EditProductPage } from "@/features/products/views/EditProductPage"

export const Route = createFileRoute("/products/$productId_/edit")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: EditProductRoute,
})

function EditProductRoute() {
  const { productId } = Route.useParams()
  return <EditProductPage productId={productId} />
}
