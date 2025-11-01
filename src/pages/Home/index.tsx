import { Card } from "@/components/ui/Card";
import { BanknoteArrowDown, TrendingUp } from "lucide-react";
import type { CategoryItem } from "@/types/CategoryItem";
import { StackedBar } from "./components/StackedBar";
import { Separator } from "@/components/ui/Separator";
import { ChartBarDefault } from "./components/BarChartWithLegend";
import { Title } from "@/components/ui/Title";
import { convertToBRL } from "@/utils/functions/convertToBRL";
import { ExpenseItem } from "../Expenses/components/ExpenseItem";

const categories: CategoryItem[] = [
	{ name: "Alimentação", value: 200 },
	{ name: "Carro", value: 300 },
	{ name: "Casa", value: 500 },
];

const total = 1000;

const recentExpenses = [
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

const chartData = [
	{ month: "January", total: 186 },
	{ month: "February", total: 305 },
	{ month: "March", total: 237 },
	{ month: "April", total: 73 },
	{ month: "May", total: 209 },
	{ month: "June", total: 214 },
];

export const HomePage = () => {
	return (
		<>
			<div className="flex gap-default h-35">
				<Card className="flex flex-1 flex-col bg-primary text-white justify-center items-center gap-0 border-none">
					<h3 className="text-sm opacity-90">Total esse mês</h3>
					<p className="text-3xl font-bold mt-1">R$2.000</p>
					<div
						className={`flex items-center justify-center gap-1 mt-2 text-sm`}
					>
						<TrendingUp className="h-4 w-4" />
						<span>6.3% desde o último mês</span>
					</div>
				</Card>

				<Card className="flex flex-1 flex-col p-default text-black justify-center items-center gap-0">
					<BanknoteArrowDown className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
					<p className="text-sm text-muted-foreground">Transações</p>
					<p className="font-bold text-3xl mt-1">87</p>
				</Card>
			</div>

			<Card className="flex flex-col gap-5">
				<Title>Custo por categoria</Title>

				<StackedBar categories={categories} total={total} />

				<ul className="flex flex-col gap-1">
					{categories.map((item, index) => (
						<div key={item.name}>
							<div className="flex items-center justify-between py-2">
								<div className="flex items-center gap-3">
									<span className="font-medium">{item.name}</span>
								</div>

								<div className="text-right">
									<p className="font-bold">{convertToBRL(item.value)}</p>
									<p className="text-xs text-muted-foreground">
										{(
											(item.value /
												categories.reduce((sum, cat) => sum + cat.value, 0)) *
											100
										).toFixed(0)}
										%
									</p>
								</div>
							</div>

							{index < categories.length - 1 && <Separator />}
						</div>
					))}
				</ul>
			</Card>

			<Card className="flex flex-col gap-5">
				<Title>Últimos 6 meses</Title>

				<div className="h-30">
					<ChartBarDefault data={chartData} />
				</div>
			</Card>

			<Card className="flex flex-col gap-5">
				<Title>Despesas recentes</Title>

				<ul>
					<div className="flex w-full flex-col gap-2">
						{recentExpenses.map((expense) => (
							<ExpenseItem
								key={expense.id}
								title={expense.title}
								price={expense.price}
								category={expense.category}
								date={new Date(expense.date)}
							/>
						))}
					</div>
				</ul>
			</Card>
		</>
	);
};
