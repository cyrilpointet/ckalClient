import type { ReactNode } from "react"
import { useRouter, useCanGoBack } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

interface PageLayoutProps {
  title?: string
  children: ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-1 px-4 md:hidden bg-primary/50 border-none">
          <div className="flex items-center bg-white rounded-full border shadow-xs fixed top-0 left-0 mt-2 ml-3">
            <SidebarTrigger variant="ghost" className="rounded-full" />
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.history.back()} disabled={!canGoBack}>
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.history.forward()}>
              <ChevronRight />
            </Button>
          </div>
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
