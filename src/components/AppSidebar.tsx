import { Home, List, Target, UtensilsCrossed, Download, CookingPot } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
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
  { titleKey: "components.AppSidebar.home", to: "/", icon: Home },
  { titleKey: "components.AppSidebar.consumption", to: "/consumption", icon: UtensilsCrossed },
  { titleKey: "components.AppSidebar.recipes", to: "/recipes", icon: CookingPot },
  { titleKey: "components.AppSidebar.products", to: "/products", icon: List },
  { titleKey: "components.AppSidebar.goal", to: "/daily-calories", icon: Target },
] as const

export function AppSidebar() {
  const location = useLocation()
  const { canInstall, promptInstall } = useInstallPrompt()
  const { t } = useTranslation()

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
                      <span>{t(item.titleKey)}</span>
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
                <span>{t("components.AppSidebar.install")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
