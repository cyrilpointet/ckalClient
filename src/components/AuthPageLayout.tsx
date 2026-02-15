import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthPageLayoutProps {
  title?: string
  children: ReactNode
}

export function AuthPageLayout({ title, children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-primary/50">
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
