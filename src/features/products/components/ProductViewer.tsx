import { useTranslation } from "react-i18next"
import { marked } from "marked"
import "./ProductViewer.css"

interface ProductViewerProps {
  name: string
  description: string | null
  kcal: number
  protein?: number | null
  carbohydrate?: number | null
  lipid?: number | null
  showName?: boolean
}

export function ProductViewer({ name, description, kcal, protein, carbohydrate, lipid, showName = true }: ProductViewerProps) {
  const { t } = useTranslation()
  const hasMacros = protein != null || carbohydrate != null || lipid != null

  return (
    <div className="flex flex-col gap-4">
      {showName && <h3 className="text-center text-lg font-semibold">{name}</h3>}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {t("components.ProductViewer.calories")}
        </span>
        <span className="font-medium">{kcal} kcal</span>
      </div>
      {hasMacros && (
        <div className="grid grid-cols-3 gap-2 text-sm text-center">
          <div>
            <span className="text-muted-foreground">{t("components.ProductViewer.protein")}</span>
            <p className="font-medium">{protein != null ? `${protein}g` : "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t("components.ProductViewer.carbohydrate")}</span>
            <p className="font-medium">{carbohydrate != null ? `${carbohydrate}g` : "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t("components.ProductViewer.lipid")}</span>
            <p className="font-medium">{lipid != null ? `${lipid}g` : "—"}</p>
          </div>
        </div>
      )}
      {description && (
        <div
          className="productviewer prose prose-sm max-w-none text-sm"
          dangerouslySetInnerHTML={{
            __html: marked.parse(description, { async: false }) as string,
          }}
        />
      )}
    </div>
  )
}
