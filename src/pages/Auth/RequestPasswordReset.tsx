import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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

const requestResetSchema = z.object({
  email: z.string().email("Email inválido"),
});

type RequestResetForm = z.infer<typeof requestResetSchema>;

export function RequestPasswordReset() {
  const form = useForm<RequestResetForm>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RequestResetForm) => {
    try {
      await authService.requestPasswordReset(data.email);
      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
      form.reset();
    } catch (error) {
      let errorMessage: string;

      if (error instanceof ApiError) {
        errorMessage = error.data.error;
      } else {
        errorMessage = "Falha ao solicitar recuperação. Tente novamente.";
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Recuperar Senha
          </h1>
          <p className="text-muted-foreground mt-2">
            Insira seu email para receber um link de recuperação
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recuperação de Conta</CardTitle>
            <CardDescription>
              Enviaremos um link para você redefinir sua senha
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
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
                  {form.formState.isSubmitting ? "Enviando..." : "Enviar Email"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col justify-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Voltar para Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
