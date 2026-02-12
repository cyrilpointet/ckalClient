import { Home, List, Target, UtensilsCrossed, Download } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useInstallPrompt } from "@/hooks/use-install-prompt"

const navItems = [
  { title: "Accueil", to: "/", icon: Home },
  { title: "Consommation", to: "/consumption", icon: UtensilsCrossed },
  { title: "Produits", to: "/products", icon: List },
  { title: "Objectif", to: "/daily-calories", icon: Target },
] as const

export function AppSidebar() {
  const location = useLocation()
  const { canInstall, promptInstall } = useInstallPrompt()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.to)
                    }
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {canInstall && (
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={promptInstall}>
                <Download />
                <span>Installer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
