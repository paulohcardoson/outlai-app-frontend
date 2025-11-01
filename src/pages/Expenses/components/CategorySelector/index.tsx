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
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import {
	CheckIcon,
	ChevronsUpDownIcon,
	EditIcon,
	ForwardIcon,
} from "lucide-react";
import { useState } from "react";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { defaultCategories } from "@/constants/categories";

export type Props = React.ComponentProps<"div"> & {
	category: string;
	onSelectCategory: (data: string) => void;
};

export const CategorySelector = ({
	category,
	onSelectCategory,
	className,
	...props
}: Props) => {
	// Category dropdown
	const [open, setOpen] = useState(false);

	// State
	const [customCategory, setCustomCategory] = useState("");

	return (
		<div className={cn("flex gap-3", className)} {...props}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="flex-1 justify-between"
					>
						{category}

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
							<CommandEmpty>Nenhuma categoria correspondente</CommandEmpty>

							<CommandGroup>
								{defaultCategories.map((_category) => (
									<CommandItem
										key={_category}
										value={_category}
										onSelect={() => {
											onSelectCategory(_category);
											setOpen(false);
										}}
									>
										{_category}
										<CheckIcon
											className={cn(
												"ml-auto",
												_category === category ? "opacity-100" : "opacity-0",
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
							onChange={(event) => setCustomCategory(event.target.value)}
						/>

						<DialogClose
							asChild
							onClick={() => {
								onSelectCategory(customCategory);
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
	);
};
