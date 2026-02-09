import { createFileRoute, redirect } from "@tanstack/react-router"
import { useUser, useLogout } from "@/features/auth/api/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: HomePage,
})

function HomePage() {
  const { data: user } = useUser()
  const logout = useLogout()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Bienvenue{user?.username ? `, ${user.username}` : ""} !
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="destructive"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Déconnexion..." : "Déconnexion"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
