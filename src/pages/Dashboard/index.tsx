import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import {
	endOfMonth,
	format,
	isWithinInterval,
	parseISO,
	startOfMonth,
	subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "../../types";
import { TrendGraph } from "./components/TrendGraph";
import { expensesService } from "@/services/expenses";
import { useExpenses } from "@/store/useExpenses"; // To get categories

export function Dashboard() {
	const { categories } = useExpenses();
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [dailyTotals, setDailyTotals] = useState<Record<string, number>>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadDashboardData = async () => {
			try {
				const now = new Date();
				const startDate = format(subMonths(now, 12), 'yyyy-MM-dd');
				const endDate = format(now, 'yyyy-MM-dd');

				const [expensesResponse, totalsResponse] = await Promise.all([
					expensesService.getAll(1, 1000),
					expensesService.getTotalsByPeriod(startDate, endDate),
				]);

				setExpenses(expensesResponse.data);
				setDailyTotals(totalsResponse);
			} catch (error) {
				console.error("Failed to load dashboard data", error);
			} finally {
				setIsLoading(false);
			}
		};
		loadDashboardData();
	}, []);

	const stats = useMemo(() => {
		const now = new Date();
		const currentMonthKey = format(now, 'MM/yyyy');
		const lastMonthKey = format(subMonths(now, 1), 'MM/yyyy');

		const currentTotal = dailyTotals[currentMonthKey] || 0;
		const lastTotal = dailyTotals[lastMonthKey] || 0;

		const percentageChange =
			lastTotal === 0
				? currentTotal > 0
					? 100
					: 0
				: ((currentTotal - lastTotal) / lastTotal) * 100;

		// Filter expenses for Category Chart (Current Month only)
		const currentMonthStart = startOfMonth(now);
		const currentMonthEnd = endOfMonth(now);

		const currentMonthExpenses = expenses.filter((e) =>
			isWithinInterval(typeof e.date === 'string' ? parseISO(e.date) : e.date, {
				start: currentMonthStart,
				end: currentMonthEnd,
			}),
		);

		// Category breakdown
		const categoryData = categories
			.map((cat) => {
				const total = currentMonthExpenses
					.filter((e) => e.category === cat.id)
					.reduce((sum, e) => sum + e.amount, 0);
				return { name: cat.name, value: total, color: cat.color };
			})
			.filter((d) => d.value > 0);

		return {
			currentTotal,
			lastTotal,
			percentageChange,
			categoryData,
			recentExpenses: [...expenses]
				.sort((a, b) => (typeof b.date === 'string' ? parseISO(b.date) : b.date).getTime() - (typeof a.date === 'string' ? parseISO(a.date) : a.date).getTime())
				.slice(0, 5),
		};
	}, [expenses, dailyTotals, categories]);

	if (isLoading) {
		return <div className="p-8 text-center">Carregando dashboard...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Summary Card */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total de Gastos (Este Mês)
						</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.currentTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
						</div>
						<p className="text-xs text-muted-foreground mt-1 flex items-center">
							{stats.percentageChange > 0 ? (
								<ArrowUpRight className="mr-1 h-4 w-4 text-destructive" />
							) : (
								<ArrowDownRight className="mr-1 h-4 w-4 text-emerald-500" />
							)}
							<span
								className={
									stats.percentageChange > 0
										? "text-destructive"
										: "text-emerald-500"
								}
							>
								{Math.abs(stats.percentageChange).toFixed(1)}%
							</span>
							<span className="ml-1">em relação ao mês passado</span>
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Graph */}
			<TrendGraph dailyTotals={dailyTotals} />

			<div className="grid gap-4 md:grid-cols-2">
				{/* Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Gastos por Categoria</CardTitle>
						<CardDescription>
							Para onde seu dinheiro foi este mês
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px] w-full">
							{stats.categoryData.length > 0 ? (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={stats.categoryData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{stats.categoryData.map((entry) => (
												<Cell key={`cell-${entry.name}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip
											formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
											contentStyle={{
												backgroundColor: "var(--card)",
												borderColor: "var(--border)",
												borderRadius: "var(--radius)",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="flex h-full items-center justify-center text-muted-foreground">
									Sem gastos este mês
								</div>
							)}
						</div>
						<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
							{stats.categoryData.map((cat) => (
								<div key={cat.name} className="flex items-center gap-2">
									<div
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: cat.color }}
									/>
									<span className="text-muted-foreground">{cat.name}</span>
									<span className="ml-auto font-medium">
										{cat.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent Transactions */}
				<Card>
					<CardHeader>
						<CardTitle>Transações Recentes</CardTitle>
						<CardDescription>Seus últimos gastos</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentExpenses.length > 0 ? (
								stats.recentExpenses.map((expense) => {
									const category = categories.find(
										(c) => c.id === expense.category,
									);
									return (
										<div
											key={expense.id}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-4 min-w-0">
												<div
													className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border"
													style={{
														backgroundColor: `${category?.color}20`,
														color: category?.color,
													}}
												>
													<Wallet className="h-4 w-4" />
												</div>
												<div className="space-y-1 min-w-0">
													<p className="text-sm font-medium leading-none truncate">
														{expense.description}
													</p>
													<p className="text-xs text-muted-foreground">
														{format(typeof expense.date === 'string' ? parseISO(expense.date) : expense.date, "d MMM, yyyy", {
															locale: ptBR,
														})}
													</p>
												</div>
											</div>
											<div className="font-medium whitespace-nowrap flex-shrink-0 ml-4">
												-{expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
											</div>
										</div>
									);
								})
							) : (
								<div className="text-center text-muted-foreground py-8">
									Nenhuma transação recente
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
