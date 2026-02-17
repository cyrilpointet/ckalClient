import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Camera, LoaderCircleIcon } from "lucide-react"
import imageCompression from "browser-image-compression"
import apiClient from "@/lib/axios"
import { useCreateProduct } from "@/features/products/api/useCreateProduct"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductViewer } from "./ProductViewer"

interface PictureResult {
  name: string
  description: string
  total_calories: number
  protein: number | null
  carbohydrate: number | null
  lipid: number | null
}

interface PictureProductDialogProps {
  children?: React.ReactNode
  className?: string
}

export function PictureProductDialog({ children, className }: PictureProductDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<PictureResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const createProduct = useCreateProduct()

  const analyzeMutation = useMutation({
    mutationFn: (image: string) =>
      apiClient.post<PictureResult>("/ai/picture-kcalculator", { image }).then((r) => r.data),
    onSuccess: (data) => {
      setResult(data)
    },
    onError: () => {
      toast.error(t("features.products.components.PictureProductDialog.analyzeError"))
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(selected)
  }

  const handleConfirm = async () => {
    if (!file) return
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 2048,
    }
    const compressedFile = await imageCompression(file, options)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      analyzeMutation.mutate(base64)
    }
    reader.readAsDataURL(compressedFile)
  }

  const handleCreate = () => {
    if (!result) return
    createProduct.mutate({
      name: result.name,
      description: result.description || null,
      kcal: result.total_calories,
      protein: result.protein,
      carbohydrate: result.carbohydrate,
      lipid: result.lipid,
      isRecipe: false,
    })
  }

  const resetState = () => {
    setPreview(null)
    setFile(null)
    setResult(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetState()
    }
  }

  const isPending = analyzeMutation.isPending || createProduct.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <div className={className}>
            <Button className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              {t("features.products.components.PictureProductDialog.photo")}
            </Button>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("features.products.components.PictureProductDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("features.products.components.PictureProductDialog.description")}
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <>
            <ProductViewer
              name={result.name}
              description={result.description}
              kcal={result.total_calories}
              protein={result.protein}
              carbohydrate={result.carbohydrate}
              lipid={result.lipid}
            />
            <DialogFooter className="gap-2 grid grid-cols-2">
              <Button variant="outline" onClick={resetState}>
                {t("features.products.components.PictureProductDialog.cancel")}
              </Button>
              <Button onClick={handleCreate} disabled={createProduct.isPending}>
                {createProduct.isPending
                  ? <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  : null}
                {t("features.products.components.PictureProductDialog.create")}
              </Button>
            </DialogFooter>
          </>
        ) : preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-md object-contain max-h-64"
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={resetState} disabled={isPending}>
                {t("features.products.components.PictureProductDialog.cancel")}
              </Button>
              <Button onClick={handleConfirm} disabled={isPending}>
                {analyzeMutation.isPending
                  ? <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  : null}
                {analyzeMutation.isPending
                  ? t("features.products.components.PictureProductDialog.analyzing")
                  : t("features.products.components.PictureProductDialog.confirm")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,android/allowCamera"
              onChange={handleFileChange}
              className="hidden"
              capture="environment"
            />
            <Button className="w-full" onClick={() => inputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" />
              {t("features.products.components.PictureProductDialog.chooseImage")}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
