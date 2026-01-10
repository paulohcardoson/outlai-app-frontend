import { Button } from "@components/ui/button";

import { Calendar } from "@components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@components/ui/popover";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	CalendarIcon,
	Check,
	Loader2,
	Plus,
	Trash2,
	Upload,
} from "lucide-react";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { processNotaFiscal } from "../../services/ocr";
import { useExpenses } from "../../store/useExpenses";

const formSchema = z.object({
	amount: z.string().min(1, "Valor é obrigatório"),
	description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
	category: z.string().min(1, "Categoria é obrigatória"),
	date: z.date(),
});

export function AddExpensePage() {
	const { categories, addExpense } = useExpenses();

	const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [stagedExpenses, setStagedExpenses] = useState<any[]>([]);

	const [isDragging, setIsDragging] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: "",
			description: "",
			category: "",
			date: new Date(),
		},
	});

	const onSubmitManual = (values: z.infer<typeof formSchema>) => {
		const numericAmount = parseFloat(values.amount.replace(",", "."));
		const expense = {
			amount: numericAmount,
			description: values.description,
			category: values.category,
			date: format(values.date, "yyyy-MM-dd"),
			tempId: Math.random().toString(), // Add tempId for staging
		};

		// Add to staged expenses instead of direct save
		setStagedExpenses((prev) => [...prev, expense]);
		setIsManualDialogOpen(false);
		form.reset();
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		processFile(file);
	};

	const processFile = async (file: File) => {
		setIsProcessing(true);
		try {
			const expenses = await processNotaFiscal(file);
			// Add processed expenses to staging area
			const expensesWithId = expenses.map((e) => ({
				...e,
				tempId: Math.random().toString(),
			}));
			setStagedExpenses((prev) => [...prev, ...expensesWithId]);
			setIsUploadDialogOpen(false);
		} catch (error) {
			console.error("Error processing file:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	const handleSaveStaged = async () => {
		setIsSaving(true);
		try {
			// Save all expenses concurrently
			await Promise.all(
				stagedExpenses.map((expense) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { tempId, ...rest } = expense;
					return addExpense(rest);
				})
			);

			setStagedExpenses([]);
			toast.success("Despesas salvas com sucesso!");
		} catch (error) {
			console.error("Failed to save expenses", error);
			toast.error("Erro ao salvar despesas. Tente novamente.");
		} finally {
			setIsSaving(false);
		}
	};

	const removeStaged = (tempId: string) => {
		setStagedExpenses((prev) => prev.filter((e) => e.tempId !== tempId));
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">
					Adicionar Despesas
				</h2>
				<p className="text-muted-foreground">
					Escolha como você quer adicionar suas novas despesas.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card
					className="hover:bg-accent/5 transition-colors cursor-pointer border-dashed"
					onClick={() => setIsManualDialogOpen(true)}
				>
					<CardHeader className="text-center">
						<div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
							<Plus className="h-8 w-8 text-primary" />
						</div>
						<CardTitle>Entrada Manual</CardTitle>
						<CardDescription>
							Digite os detalhes da despesa manualmente
						</CardDescription>
					</CardHeader>
				</Card>

				<Card
					className="hover:bg-accent/5 transition-colors cursor-pointer border-dashed"
					onClick={() => setIsUploadDialogOpen(true)}
				>
					<CardHeader className="text-center">
						<div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
							<Upload className="h-8 w-8 text-primary" />
						</div>
						<CardTitle>Upload de Nota Fiscal</CardTitle>
						<CardDescription>
							Envie uma foto ou PDF para extração automática
						</CardDescription>
					</CardHeader>
				</Card>
			</div>

			{stagedExpenses.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Despesas Extraídas ({stagedExpenses.length})</CardTitle>
						<CardDescription>
							Revise as despesas encontradas antes de salvar
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stagedExpenses.map((expense) => (
								<div
									key={expense.tempId}
									className="flex items-center justify-between p-4 border rounded-lg"
								>
									<div className="space-y-1">
										<p className="font-medium">{expense.description}</p>
										<p className="text-sm text-muted-foreground">
											{format(typeof expense.date === 'string' ? parseISO(expense.date) : expense.date, "PPP", { locale: ptBR })}
										</p>
									</div>
									<div className="flex items-center gap-4">
										<span className="font-bold">
											{expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
										</span>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeStaged(expense.tempId)}
											className="text-destructive hover:text-destructive hover:bg-destructive/10"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
							<div className="flex justify-end pt-4">
								<Button
									onClick={handleSaveStaged}
									className="w-full"
									size="sm"
									disabled={isSaving}
								>
									{isSaving ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Check className="mr-2 h-4 w-4" />
									)}
									Confirmar e Salvar Todas
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Manual Entry Dialog */}
			<Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Nova Despesa</DialogTitle>
						<DialogDescription>
							Preencha os detalhes da despesa abaixo.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitManual)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Valor</FormLabel>

										<FormControl>
											<CurrencyInput
												id="amount"
												placeholder="R$ 0,00"
												decimalsLimit={2}
												decimalScale={2}
												prefix="R$ "
												className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												onValueChange={(value) => field.onChange(value || "")}
												intlConfig={{ locale: "pt-BR", currency: "BRL" }}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descrição</FormLabel>
										<FormControl>
											<Textarea placeholder="Ex: Compras do mês" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Categoria</FormLabel>
										<div className="grid grid-cols-2 gap-2">
											{categories.map((cat) => (
												<button
													key={cat.id}
													type="button"
													onClick={() => field.onChange(cat.id)}
													className={cn(
														"cursor-pointer rounded-md border p-2 flex items-center gap-2 transition-all hover:bg-accent hover:text-accent-foreground",
														field.value === cat.id
															? "border-primary bg-primary/5 ring-1 ring-primary"
															: "border-input",
													)}
												>
													<div
														className="h-3 w-3 rounded-full"
														style={{ backgroundColor: cat.color }}
													/>
													<span className="text-sm">{cat.name}</span>
													{field.value === cat.id && (
														<Check className="ml-auto h-3 w-3 text-primary" />
													)}
												</button>
											))}
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Data</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value ? (
															format(field.value, "PPP", { locale: ptBR })
														) : (
															<span>Selecione uma data</span>
														)}
													</Button>
												</FormControl>
											</PopoverTrigger>

											<PopoverContent>
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													autoFocus
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type="submit">Salvar Despesa</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Upload Dialog */}
			<Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload de Nota Fiscal</DialogTitle>
						<DialogDescription>
							Envie uma foto da sua nota fiscal para processamento automático.
						</DialogDescription>
					</DialogHeader>
					<div className="grid w-full max-w-sm items-center gap-1.5 mx-auto py-8">
						{isProcessing ? (
							<div className="flex flex-col items-center justify-center space-y-4">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
								<p className="text-sm text-muted-foreground">
									Processando nota fiscal...
								</p>
							</div>
						) : (
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="dropzone-file"
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									className={cn(
										"flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
										isDragging
											? "border-primary bg-primary/10"
											: "border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800",
									)}
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<Upload
											className={cn(
												"w-8 h-8 mb-4",
												isDragging
													? "text-primary"
													: "text-gray-500 dark:text-gray-400",
											)}
										/>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											<span className="font-semibold">Clique para enviar</span>{" "}
											ou arraste e solte
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											PNG, JPG ou PDF (MAX. 5MB)
										</p>
									</div>
									<Input
										id="dropzone-file"
										type="file"
										className="hidden"
										accept="image/*,application/pdf"
										onChange={handleFileUpload}
									/>
								</label>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
