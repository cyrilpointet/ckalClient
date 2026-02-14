import { createRootRoute, Outlet } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  InstallPromptContext,
  useInstallPromptProvider,
} from "@/hooks/use-install-prompt"
import { InstallPromptModal } from "@/components/InstallPromptModal"
import { useUser } from "@/features/auth/api/useAuth"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootInner />
    </QueryClientProvider>
  )
}

function RootInner() {
  const { data: user } = useUser()
  const installPrompt = useInstallPromptProvider(!!user)

  return (
    <InstallPromptContext.Provider value={installPrompt}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Outlet />
        </div>
        <Toaster />
        <InstallPromptModal />
      </TooltipProvider>
    </InstallPromptContext.Provider>
  )
}
