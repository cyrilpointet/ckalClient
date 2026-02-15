import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { LoaderCircleIcon, ScanBarcode } from "lucide-react"
import apiClient from "@/lib/axios"
import { useCreateProduct } from "@/features/products/api/useCreateProduct"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarcodeScanner } from "./BarcodeScanner"

interface OffProduct {
  name: string
  description: string
  weight: number
  kcal: number
}

interface ScanProductDialogProps {
  children?: React.ReactNode
  className?: string
}

export function ScanProductDialog({ children, className }: ScanProductDialogProps) {
  const { t } = useTranslation()
  const [isScanOpen, setIsScanOpen] = useState(false)
  const createProduct = useCreateProduct()

  const scanMutation = useMutation({
    mutationFn: (code: string) =>
      apiClient.get<OffProduct>(`/off/${code}`).then((r) => r.data),
    onSuccess: (data) => {
      createProduct.mutate({
        name: data.name,
        description: data.description || null,
        kcal: data.kcal,
        isRecipe: false,
      })
    },
    onError: () => {
      toast.error(
        t("features.products.components.ScanProductDialog.scanError"),
      )
    },
  })

  const handleScan = (code: string) => {
    setIsScanOpen(false)
    scanMutation.mutate(code)
  }

  const isPending = scanMutation.isPending || createProduct.isPending

  return (
    <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <div className={className}>
            <Button variant="outline" disabled={isPending} className="w-full">
              {isPending ? (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ScanBarcode className="mr-2 h-4 w-4" />
              )}
              {isPending
                ? t("features.products.components.ScanProductDialog.scanning")
                : t("features.products.components.ScanProductDialog.scan")}
            </Button>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("features.products.components.ScanProductDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("features.products.components.ScanProductDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <BarcodeScanner onScan={handleScan} />
      </DialogContent>
    </Dialog>
  )
}
