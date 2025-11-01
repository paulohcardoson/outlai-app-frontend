"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "./chart";

const chartConfig = {
	total: {
		label: "Total",
		color: "var(--color-primary)",
	},
} satisfies ChartConfig;

export interface Props {
	data: {
		month: string;
		total: number;
	}[];
}

export function ChartBarDefault({ data }: Props) {
	return (
		<ChartContainer config={chartConfig} className="w-full h-full">
			<BarChart accessibilityLayer data={data}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar dataKey="total" fill="var(--color-primary)" radius={8} />
			</BarChart>
		</ChartContainer>
	);
}
