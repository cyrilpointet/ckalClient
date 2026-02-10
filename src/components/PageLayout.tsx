import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface PageLayoutProps {
  title?: string
  children: ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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
