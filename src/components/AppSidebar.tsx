import { Home, List, Target, UtensilsCrossed, Download, CookingPot, Sparkles, LogOut } from "lucide-react"
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
import { useLogout } from "@/features/auth/api/useAuth"

const navItems = [
  { titleKey: "components.AppSidebar.home", to: "/", icon: Home },
  { titleKey: "components.AppSidebar.consumption", to: "/consumption", icon: UtensilsCrossed },
  { titleKey: "components.AppSidebar.recipeGenerator", to: "/recipe-generator", icon: Sparkles },
  { titleKey: "components.AppSidebar.recipes", to: "/recipes", icon: CookingPot },
  { titleKey: "components.AppSidebar.products", to: "/products", icon: List },
  { titleKey: "components.AppSidebar.goal", to: "/daily-calories", icon: Target },
] as const

export function AppSidebar() {
  const location = useLocation()
  const { canInstall, promptInstall } = useInstallPrompt()
  const { t } = useTranslation()
  const logout = useLogout()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    className="font-semibold"
                    size="lg"
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
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          {canInstall && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={promptInstall}>
                <Download />
                <span>{t("components.AppSidebar.install")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-destructive hover:text-destructive"
            >
              <LogOut />
              <span>
                {logout.isPending
                  ? t("components.AppSidebar.loggingOut")
                  : t("components.AppSidebar.logout")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
