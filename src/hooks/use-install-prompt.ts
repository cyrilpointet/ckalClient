import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { BeforeInstallPromptEvent } from "@/types/pwa"

const SNOOZE_KEY = "pwa-install-snoozed-at"
const SNOOZE_DAYS = 7

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isSnoozed(): boolean {
  const raw = localStorage.getItem(SNOOZE_KEY)
  if (!raw) return false
  const snoozedAt = new Date(raw)
  const now = new Date()
  const diffDays =
    (now.getTime() - snoozedAt.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays < SNOOZE_DAYS
}

function snooze(): void {
  localStorage.setItem(SNOOZE_KEY, new Date().toISOString())
}

interface InstallPromptContextValue {
  canInstall: boolean
  showModal: boolean
  promptInstall: () => Promise<void>
  dismissModal: () => void
}

export const InstallPromptContext =
  createContext<InstallPromptContextValue | null>(null)

export function useInstallPromptProvider(): InstallPromptContextValue {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isStandalone()) return

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!isSnoozed()) {
        setShowModal(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "dismissed") {
      snooze()
    }
    setDeferredPrompt(null)
    setShowModal(false)
  }, [deferredPrompt])

  const dismissModal = useCallback(() => {
    snooze()
    setShowModal(false)
  }, [])

  return {
    canInstall: deferredPrompt !== null,
    showModal,
    promptInstall,
    dismissModal,
  }
}

export function useInstallPrompt(): InstallPromptContextValue {
  const context = useContext(InstallPromptContext)
  if (!context) {
    throw new Error(
      "useInstallPrompt must be used within an InstallPromptProvider"
    )
  }
  return context
}
