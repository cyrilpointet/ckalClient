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

import restaurantImage from "@/assets/restaurant.png"

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
            <p>
              {t("components.InstallPromptModal.description")}
            </p>
            <img
              src={restaurantImage}
              alt="Empty"
              className="mx-auto my-4 h-20 w-20"
            />
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
