import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { authService } from "@/services/auth";
import { ApiError } from "@/lib/api-client";
import { useEffect } from "react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("user-id");
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    console.log({
      userId,
      token
    })
    if (!userId || !token) {
      navigate("/login");
    }
  }, [userId, token, navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!userId || !token) return;

    try {
      await authService.resetPassword(userId, token, data.password);
      toast.success("Senha redefinida com sucesso! Faça login com sua nova senha.");
      navigate("/login");
    } catch (error) {
      let errorMessage: string;

      if (error instanceof ApiError) {
        errorMessage = error.data.error;
      } else {
        errorMessage = "Falha ao redefinir senha. O link pode ter expirado.";
      }

      toast.error(errorMessage);
    }
  };

  if (!userId || !token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Redefinir Senha
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie uma nova senha para sua conta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Senha</CardTitle>
            <CardDescription>
              A senha deve ter no mínimo 8 caracteres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col justify-center space-y-2">
            <div className="text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Cancelar e voltar para Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
