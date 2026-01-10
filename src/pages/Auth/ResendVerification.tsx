import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { ApiError } from "@/lib/api-client";
import { authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const resendSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ResendFormValues = z.infer<typeof resendSchema>;

export function ResendVerification() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResendFormValues) => {
    setIsLoading(true);
    try {
      await authService.resendVerification(data.email);
      toast.success("Email de verificação enviado! Verifique sua caixa de entrada.");
      navigate("/login");
    } catch (error) {
      let errorMessage: string;

      if (error instanceof ApiError) {
        errorMessage = error.data.error || "Falha ao reenviar verificação.";
      } else {
        errorMessage = "Falha ao reenviar verificação. Tente novamente.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verificar Email
          </CardTitle>
          <CardDescription className="text-center">
            Digite seu email para receber um novo link de verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar Link
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
            <Link
              to="/login"
              className="hover:text-primary underline underline-offset-4 flex items-center justify-center gap-2"
            >
              <MoveLeft className="h-4 w-4" /> Voltar para o login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
