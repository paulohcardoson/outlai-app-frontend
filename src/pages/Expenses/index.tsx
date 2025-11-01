import { Card } from "@/components/ui/Card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Title } from "@/components/ui/Title";
import { SearchIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/InputGroup/input-group";
import { ExpenseItem } from "./components/ExpenseItem";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/Pagination";

const allExpenses = [
	{
		id: 1,
		title: "Grocery Shopping",
		price: 85.5,
		category: "Food",
		date: "2024-10-05",
		description: "Weekly grocery shopping at Whole Foods",
		hasImage: true,
		imageUrl:
			"https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBlbnNlJTIwcmVjZWlwdCUyMHNob3BwaW5nfGVufDF8fHx8MTc1OTY4MjQzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
	},
	{
		id: 2,
		title: "Gas Station",
		price: 45.0,
		category: "Transport",
		date: "2024-10-04",
		description: "Shell gas station fill-up",
		hasImage: false,
	},
	{
		id: 3,
		title: "Coffee Shop",
		price: 12.5,
		category: "Food",
		date: "2024-10-04",
		description: "Morning coffee and pastry",
		hasImage: false,
	},
	{
		id: 4,
		title: "Movie Tickets",
		price: 28.0,
		category: "Entertainment",
		date: "2024-10-03",
		description: "Two tickets for evening show",
		hasImage: false,
	},
	{
		id: 5,
		title: "Electricity Bill",
		price: 145.0,
		category: "Bills",
		date: "2024-10-01",
		description: "Monthly electricity payment",
		hasImage: false,
	},
	{
		id: 6,
		title: "Uber Ride",
		price: 23.5,
		category: "Transport",
		date: "2024-09-30",
		description: "Ride to downtown",
		hasImage: false,
	},
	{
		id: 7,
		title: "Restaurant Dinner",
		price: 67.8,
		category: "Food",
		date: "2024-09-29",
		description: "Dinner at Italian restaurant",
		hasImage: false,
	},
	{
		id: 8,
		title: "Online Shopping",
		price: 129.99,
		category: "Shopping",
		date: "2024-09-28",
		description: "Clothes from Amazon",
		hasImage: false,
	},
];

const categories = [
	"All",
	"Food",
	"Transport",
	"Entertainment",
	"Shopping",
	"Bills",
	"Healthcare",
	"Education",
	"Travel",
	"Other",
];
const orderByOptions = [
	"Lançamento crescente",
	"Lançamento decrecente",
	"Maior valor",
	"Menor valor",
	"Nome",
];

export const ExpensesPage = () => {
	return (
		<>
			<Card>
				<Title>Gastos</Title>

				<InputGroup>
					<InputGroupAddon align={"inline-start"}>
						<SearchIcon />
					</InputGroupAddon>

					<InputGroupInput placeholder="Buscar despesas" />

					<InputGroupAddon align={"inline-end"}>
						<InputGroupButton variant={"default"}>Buscar</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>

				<div className="flex justify-between gap-2">
					<div className="flex flex-col gap-0.5 w-full">
						<h3 className="text-sm opacity-50">Categoria</h3>

						<Select>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="All" />
							</SelectTrigger>

							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-0.5 w-full">
						<h3 className="text-sm opacity-50">Ordem</h3>

						<Select>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="All" />
							</SelectTrigger>

							<SelectContent>
								{orderByOptions.map((option) => {
									return (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>
				</div>
			</Card>

			{allExpenses.map((expense) => {
				return (
					<ExpenseItem
						key={expense.id}
						title={expense.title}
						category={expense.category}
						price={expense.price}
						date={new Date(expense.date)}
						isEditable
					/>
				);
			})}

			<Pagination className="justify-end">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious text="Anterior" href="#" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink>1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink isActive>2</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink>3</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#">50</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext text="Próximo" href="#" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</>
	);
};
