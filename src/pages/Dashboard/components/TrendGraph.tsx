import { Button } from "@components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@components/ui/card";
import {
	eachMonthOfInterval,
	endOfMonth,
	format,
	isSameMonth,
	parse,
	startOfMonth,
	subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";


interface TrendGraphProps {
	dailyTotals: Record<string, number>;
}

type TimeRange = "2m" | "6m" | "1y";

export function TrendGraph({ dailyTotals }: TrendGraphProps) {
	const [timeRange, setTimeRange] = useState<TimeRange>("6m");

	const data = useMemo(() => {
		const now = new Date();
		let startDate = new Date();

		switch (timeRange) {
			case "2m":
				startDate = subMonths(now, 1); // Current + Previous
				break;
			case "6m":
				startDate = subMonths(now, 5); // Current + 5 Previous
				break;
			case "1y":
				startDate = subMonths(now, 11); // Current + 11 Previous
				break;
		}

		const interval = { start: startOfMonth(startDate), end: endOfMonth(now) };
		const months = eachMonthOfInterval(interval);

		return months.map((month) => {
			let total = 0;

			Object.entries(dailyTotals).forEach(([dateStr, amount]) => {
				if (isSameMonth(parse(dateStr, "MM/yyyy", new Date()), month)) {
					total += amount;
				}
			});

			return {
				name: format(month, "MMM", { locale: ptBR }),
				fullDate: format(month, "MMMM yyyy", { locale: ptBR }),
				total,
			};
		});
	}, [dailyTotals, timeRange]);

	return (
		<Card>
			<CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
				<div className="space-y-1">
					<CardTitle>Tendência de Gastos</CardTitle>
					<CardDescription>
						Acompanhe seus gastos ao longo do tempo
					</CardDescription>
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant={timeRange === "2m" ? "default" : "outline"}
						size="sm"
						onClick={() => setTimeRange("2m")}
					>
						2 Meses
					</Button>
					<Button
						variant={timeRange === "6m" ? "default" : "outline"}
						size="sm"
						onClick={() => setTimeRange("6m")}
					>
						6 Meses
					</Button>
					<Button
						variant={timeRange === "1y" ? "default" : "outline"}
						size="sm"
						onClick={() => setTimeRange("1y")}
					>
						1 Ano
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								dataKey="name"
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `R$${value}`}
							/>
							<Tooltip
								cursor={{ fill: "transparent" }}
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										return (
											<div className="rounded-lg border bg-background p-2 shadow-sm">
												<div className="grid grid-cols-2 gap-2">
													<div className="flex flex-col">
														<span className="text-[0.70rem] uppercase text-muted-foreground">
															{payload[0].payload.fullDate}
														</span>
														<span className="font-bold text-muted-foreground">
															{payload[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
														</span>
													</div>
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							<Bar
								dataKey="total"
								fill="var(--secondary)"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
