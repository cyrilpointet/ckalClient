import type { ReactNode } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

interface PageLayoutProps {
  title?: string
  children: ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center px-4 md:hidden bg-primary/50 border-none">
          <SidebarTrigger className="rounded-full" variant="outline" />
        </header>
        <div className="flex flex-1 flex-col items-center p-4 bg-primary/50">
          <Card className="w-full max-w-md bg-white">
            {title && (
              <CardHeader>
                <CardTitle className="text-center text-2xl">{title}</CardTitle>
              </CardHeader>
            )}
            {children}
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
