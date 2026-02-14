import { useTranslation } from "react-i18next"
import { marked } from "marked"
import "./ProductViewer.css"

interface ProductViewerProps {
  name: string
  description: string | null
  kcal: number
  showName?: boolean
}

export function ProductViewer({ name, description, kcal, showName = true }: ProductViewerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      {showName && <h3 className="text-center text-lg font-semibold">{name}</h3>}
      {description && (
        <div
          className="productviewer prose prose-sm max-w-none text-sm"
          dangerouslySetInnerHTML={{
            __html: marked.parse(description, { async: false }) as string,
          }}
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {t("components.ProductViewer.calories")}
        </span>
        <span className="font-medium">{kcal} kcal</span>
      </div>
    </div>
  )
}
