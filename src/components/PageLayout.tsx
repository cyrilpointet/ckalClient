import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, List, Target, UtensilsCrossed } from "lucide-react"

interface PageLayoutProps {
  title?: string
  children: ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <nav className="sticky top-0 z-50 mb-4 flex w-full max-w-md items-center justify-around rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
        >
          <Home className="h-5 w-5" />
          Accueil
        </Link>
        <Link
          to="/consumption"
          className="flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
        >
          <UtensilsCrossed className="h-5 w-5" />
          Conso
        </Link>
        <Link
          to="/products"
          className="flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
        >
          <List className="h-5 w-5" />
          Produits
        </Link>
        <Link
          to="/daily-calories"
          className="flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
        >
          <Target className="h-5 w-5" />
          Objectif
        </Link>
      </nav>
      <Card className="w-full max-w-md">
        {title && (
          <CardHeader>
            <CardTitle className="text-center text-2xl">{title}</CardTitle>
          </CardHeader>
        )}
        {children}
      </Card>
    </div>
  )
}
