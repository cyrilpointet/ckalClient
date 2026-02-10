import { Link } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister } from "@/features/auth/api/useAuth"
import { registerSchema, type RegisterInput } from "@/features/auth/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardFooter } from "@/components/ui/card"
import { PageLayout } from "@/components/PageLayout"
import { AxiosError } from "axios"

export function RegisterPage() {
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data)
  }

  const apiError =
    registerMutation.error instanceof AxiosError
      ? registerMutation.error.response?.data?.message ??
        "Erreur lors de l'inscription"
      : registerMutation.error
        ? "Erreur lors de l'inscription"
        : null

  return (
    <PageLayout title="Inscription">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {apiError && (
              <p className="text-sm text-destructive text-center">
                {apiError}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                placeholder="Votre nom"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Inscription..." : "S'inscrire"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
    </PageLayout>
  )
}
