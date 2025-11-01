import { Button } from "@/components/ui/Button";
import {
	DollarSignIcon,
	PlusIcon,
	SendIcon,
	SparklesIcon,
	XCircleIcon,
} from "lucide-react";
import { ExpenseItem } from "../Expenses/components/ExpenseItem";
import type { Expense, ExpenseWithId } from "@/types/Outlay";
import { useId, useState } from "react";
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { DialogClose, DialogContent } from "@/components/ui/Dialog";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { Input } from "@/components/ui/Input";
import {
	InputGroup,
	InputGroupAddon,
} from "@/components/ui/InputGroup/input-group";
import CurrencyInput, { formatValue } from "react-currency-input-field";
import { Label } from "@/components/ui/Label";
import { CategorySelector } from "../Expenses/components/CategorySelector";
import { defaultCategories } from "@/constants/categories";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from "@/components/ui/Dropzone";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/AlertDialog";

export interface Inputs {
	title: string;
	price: number;
	category: string;
}

export const AddExpensePage = () => {
	// Forms Hooks
	const { register, handleSubmit, watch, setValue, reset } = useForm<Inputs>({
		defaultValues: {
			title: "",
			price: 0,
			category: defaultCategories[0],
		},
	});

	// Element ID's
	const titleInputId = useId();
	const priceInputId = useId();
	const formId = useId();

	// States
	const [expensesToPost, setExpensesToPost] = useState<ExpenseWithId[]>([
		{
			id: "1",
			title: "Grocery Shopping",
			category: "Alimentação",
			price: 29.99,
			date: new Date("10-26-2025"),
		},
	]);
	const [files, setFiles] = useState<File[] | undefined>();

	const onSubmit: SubmitHandler<Inputs> = ({ title, price, category }) => {
		addExpense({ title, price, category });
		reset();
	};

	const editExpense = (
		id: ExpenseWithId["id"],
		data: Omit<Expense, "date">,
	) => {
		const newArray = expensesToPost.map<ExpenseWithId>((expense) => {
			if (expense.id !== id) return expense;

			return {
				date: expense.date,
				id: id,
				...data,
			};
		});

		setExpensesToPost(newArray);
	};
	const deleteExpense = (id: ExpenseWithId["id"]) => {
		const newArray = expensesToPost.filter((expense) => expense.id !== id);

		setExpensesToPost(newArray);
	};
	const addExpense = (data: Omit<Expense, "date">) => {
		const id = crypto.randomUUID();
		const date = new Date();

		setExpensesToPost((expenses) => [...expenses, { id, ...data, date }]);
	};
	const deleteAllExpenses = () => {
		setExpensesToPost([]);
	};

	const publish = () => {
		// TODO
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<h2>Despesas</h2>

				<ButtonGroup>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"secondary"}>
								<PlusIcon />
								<span>Nova despesa</span>
							</Button>
						</DialogTrigger>

						<DialogContent className="gap-6">
							<DialogHeader>
								<DialogTitle>Editar despesa</DialogTitle>
							</DialogHeader>

							<form id={formId} onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor={titleInputId}>Título</Label>
										<Input
											id={titleInputId}
											placeholder="Mercado"
											{...register("title")}
										/>
									</div>

									<div className="grid gap-3">
										<Label htmlFor={priceInputId}>Preço</Label>

										<InputGroup>
											<InputGroupAddon align={"inline-start"}>
												<DollarSignIcon />
											</InputGroupAddon>

											<CurrencyInput
												id={priceInputId}
												className="outline-none h-full w-full"
												data-slot="input-group-control"
												onValueChange={(_, __, values) => {
													setValue("price", values?.float || 0);
												}}
												defaultValue={formatValue({
													value: "0,00",
													groupSeparator: ".",
													decimalSeparator: ",",
												})}
												groupSeparator="."
												decimalSeparator=","
												decimalsLimit={2}
												fixedDecimalLength={2}
											/>
										</InputGroup>
									</div>

									<div className="grid gap-3">
										<Label>Categoria</Label>

										<CategorySelector
											category={watch("category")}
											onSelectCategory={(category) => {
												setValue("category", category);
											}}
										/>
									</div>

									<div className="flex justify-between gap-3">
										<DialogClose asChild className="flex-1">
											<Button className="w-full" variant={"secondary"}>
												Cancelar
											</Button>
										</DialogClose>

										<DialogClose asChild className="flex-1">
											<Button
												className="w-full"
												variant={"default"}
												type="submit"
											>
												Salvar
											</Button>
										</DialogClose>
									</div>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					<Dialog>
						<DialogTrigger asChild>
							<Button variant={"default"}>
								<SparklesIcon />
								<span>Gerar com IA</span>
							</Button>
						</DialogTrigger>

						<DialogContent className="gap-6">
							<DialogHeader>
								<DialogTitle>Adicionar nota fiscal</DialogTitle>
							</DialogHeader>

							<form id={formId} onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-4">
									<Dropzone
										accept={{ "image/*": [] }}
										maxFiles={10}
										maxSize={1024 * 1024 * 10}
										minSize={1024}
										onDrop={(files) => setFiles(files)}
										onError={console.error}
										src={files}
									>
										<DropzoneEmptyState />
										<DropzoneContent />
									</Dropzone>

									<div className="flex justify-between gap-3">
										<DialogClose asChild className="flex-1">
											<Button className="w-full" variant={"secondary"}>
												Cancelar
											</Button>
										</DialogClose>

										<DialogClose asChild className="flex-1">
											<Button
												className="w-full"
												variant={"default"}
												type="submit"
											>
												Salvar
											</Button>
										</DialogClose>
									</div>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</ButtonGroup>
			</div>

			<main className="flex-1">
				{expensesToPost.map((expense) => (
					<ExpenseItem
						key={expense.id}
						{...expense}
						isEditable
						onEdit={(data) => editExpense(expense.id, data)}
						onDelete={() => deleteExpense(expense.id)}
					/>
				))}
			</main>

			{expensesToPost.length > 0 && (
				<div>
					<div className="flex gap-2 max-w-7xl mx-auto">
						<Button className="flex-1 gap-2 h-12" onClick={() => publish()}>
							<SendIcon className="h-4 w-4" />
							Publicar todos ({expensesToPost.length})
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="outline" className="gap-2 h-12">
									<XCircleIcon className="h-4 w-4" />
									Limpar todas
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Excluir todas as despesas?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Isso irá remover{" "}
										{expensesToPost.length === 1
											? `a despesa ${expensesToPost[0].title} `
											: "todas as despesas"}
										dessa lista. Essa ação não pode ser desfeita
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteAllExpenses()}
										className="bg-destructive hover:bg-destructive/90"
									>
										{expensesToPost.length === 1 ? "Excluir" : "Excluir todas"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			)}
		</>
	);
};
