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

export function InstallPromptModal() {
  const { showModal, promptInstall, dismissModal } = useInstallPrompt()

  return (
    <AlertDialog
      open={showModal}
      onOpenChange={(open) => !open && dismissModal()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Installer l'application</AlertDialogTitle>
          <AlertDialogDescription>
            Installez Kcal sur votre appareil pour un accès rapide et une
            meilleure expérience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Plus tard</AlertDialogCancel>
          <AlertDialogAction onClick={promptInstall}>
            Installer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
