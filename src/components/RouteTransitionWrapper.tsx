import { useEffect, type ReactNode } from "react"
import { useLocation } from "@tanstack/react-router"

interface RouteTransitionWrapperProps {
  children: ReactNode
}

export function RouteTransitionWrapper({ children }: RouteTransitionWrapperProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return children
}
