import { Badge } from "@/components/ui/Badge";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/Command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
	DialogTitle,
	DialogClose,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
	InputGroup,
	InputGroupAddon,
} from "@/components/ui/InputGroup/input-group";
import CurrencyInput, { formatValue } from "react-currency-input-field";
import { Label } from "@/components/ui/Label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { convertToBRL } from "@/utils/functions/convertToBRL";
import { formatDate } from "date-fns";
import {
	CheckIcon,
	ChevronsUpDownIcon,
	DollarSign,
	DollarSignIcon,
	EditIcon,
	ForwardIcon,
	TrashIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import type { Expense } from "@/types/Outlay";

export type Props = React.ComponentProps<"div"> &
	Expense & {
		isEditable?: boolean;
		onEdit?: (data: Omit<Expense, "date">) => void;
		onDelete?: () => void;
	};

const categories: string[] = ["Alimentação", "Carro", "Casa"];

export interface Inputs {
	title: string;
	price: number;
	category: string;
}

export const ExpenseItem = ({
	isEditable = false,
	onEdit = () => {},
	onDelete = () => {},
	className,
	...props
}: Props) => {
	// Forms Hooks
	const { register, handleSubmit, setValue, getValues } = useForm<Inputs>({
		defaultValues: {
			title: props.title,
			price: props.price,
			category: props.category,
		},
	});

	// Category dropdown
	const [open, setOpen] = useState(false);

	// Element ID's
	const titleInputId = useId();
	const priceInputId = useId();
	const formId = useId();

	// Category
	const currentCategory = getValues("category");

	// Custom category
	const [customCategory, setCustomCategory] = useState("");

	const onSubmit: SubmitHandler<Inputs> = ({ title, price, category }) => {
		onEdit({ title, price, category });
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger className={cn("flex w-full h-21")}>
				<div className="flex items-center justify-center w-10 h-full bg-primary rounded-l-xl">
					<DollarSign color="#FFF" />
				</div>

				<div
					className={cn(
						"bg-card text-card-foreground flex flex-1 rounded-r-xl items-center border px-default gap-5",
						className,
					)}
				>
					<div className="flex flex-col w-full gap-0.5">
						<h3 className="font-semibold">{props.title}</h3>
						<Badge>{props.category}</Badge>
					</div>

					<div className="text-right flex flex-col justify-center">
						<h4 className="font-medium text-base">
							{convertToBRL(props.price)}
						</h4>
						<small className="opacity-70 text-[10px]">
							{formatDate(props.date, "dd/MM/yyyy")}
						</small>
					</div>
				</div>
			</ContextMenuTrigger>

			{isEditable && (
				<ContextMenuContent className="w-40">
					<Dialog>
						<DialogTrigger asChild>
							<ContextMenuItem
								variant="default"
								onSelect={(e) => e.preventDefault()}
							>
								<EditIcon /> Editar
							</ContextMenuItem>
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
													value: props.price.toString(),
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

										<div className="flex gap-3">
											<Popover open={open} onOpenChange={setOpen}>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={open}
														className="flex-1 justify-between"
													>
														{currentCategory}

														<ChevronsUpDownIcon className="opacity-50" />
													</Button>
												</PopoverTrigger>

												<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
													<Command>
														<CommandInput
															placeholder="Selecione a categoria..."
															className="h-9"
														/>
														<CommandList>
															<CommandEmpty>
																Nenhuma categoria correspondente
															</CommandEmpty>

															<CommandGroup>
																{categories.map((category) => (
																	<CommandItem
																		key={category}
																		value={category}
																		onSelect={(currentValue) => {
																			setValue("category", currentValue);
																			setOpen(false);
																		}}
																	>
																		{category}
																		<CheckIcon
																			className={cn(
																				"ml-auto",
																				category === currentCategory
																					? "opacity-100"
																					: "opacity-0",
																			)}
																		/>
																	</CommandItem>
																))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>

											<Dialog>
												<DialogTrigger asChild>
													<Button>
														<EditIcon />
													</Button>
												</DialogTrigger>

												<DialogContent>
													<DialogHeader>
														<DialogTitle>Categoria customizada</DialogTitle>
													</DialogHeader>

													<ButtonGroup className="w-full">
														<Input
															placeholder="Limpeza"
															value={customCategory}
															onChange={(event) =>
																setCustomCategory(event.target.value)
															}
														/>

														<DialogClose
															asChild
															onClick={() => {
																setValue("category", customCategory);
																setCustomCategory("");
															}}
														>
															<Button variant={"default"} aria-label="Search">
																<ForwardIcon />
															</Button>
														</DialogClose>
													</ButtonGroup>
												</DialogContent>
											</Dialog>
										</div>
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
							<ContextMenuItem
								variant="destructive"
								onSelect={(e) => e.preventDefault()}
							>
								<TrashIcon /> Deletar
							</ContextMenuItem>
						</DialogTrigger>

						<DialogContent className="gap-6">
							<DialogHeader>
								<DialogTitle>
									Tem certeza que deseja deletar essa despesa?
								</DialogTitle>
								<DialogDescription>
									Essa ação não pode ser desfeita. A despesa "{props.title}"
									será permanentemente removida.
								</DialogDescription>
							</DialogHeader>

							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancelar</Button>
								</DialogClose>

								<DialogClose asChild>
									<Button variant={"destructive"} onClick={() => onDelete()}>
										Confirmar
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</ContextMenuContent>
			)}
		</ContextMenu>
	);
};
