import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useInstallPrompt } from "@/hooks/use-install-prompt"
import { useTranslation } from "react-i18next"

export function InstallPromptModal() {
  const { showModal, promptInstall, dismissModal } = useInstallPrompt()
  const { t } = useTranslation()

  return (
    <AlertDialog
      open={showModal}
      onOpenChange={(open) => !open && dismissModal()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("components.InstallPromptModal.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("components.InstallPromptModal.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("components.InstallPromptModal.later")}</AlertDialogCancel>
          <AlertDialogAction onClick={promptInstall}>
            {t("components.InstallPromptModal.install")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
