import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

import LogoImage from "@/assets/Logo_white.svg"

interface AuthPageLayoutProps {
  title?: string
  children: ReactNode
}

export function AuthPageLayout({ title, children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-primary/50 max-w-[100vw]">
      <Card className="w-full max-w-md">
        <img src={LogoImage} alt="Logo" className="mx-auto mb-4 text-primary" />

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
