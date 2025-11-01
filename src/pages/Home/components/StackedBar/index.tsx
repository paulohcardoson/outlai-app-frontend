import type { PropsWithChildren } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/Tooltip";
import type { CategoryItem } from "@/types/CategoryItem";

type Props = PropsWithChildren<{
	categories: CategoryItem[];
	total: number;
}>;

export const StackedBar = ({ categories, total }: Props) => {
	const categoriesWithPercentages = categories.map((category) => ({
		...category,
		percentage: (category.value / total) * 100,
	}));

	return (
		<div className="flex flex-col">
			<div className="flex justify-between gap-0.5 h-10 rounded-md overflow-hidden">
				{categoriesWithPercentages.map((category) => (
					<Tooltip key={category.name}>
						<TooltipTrigger style={{ width: `${category.percentage}%` }}>
							<div
								className={`w-full h-full bg-gray-100 hover:bg-primary duration-100`}
							/>
						</TooltipTrigger>
						<TooltipContent>{category.name}</TooltipContent>
					</Tooltip>
				))}
			</div>
		</div>
	);
};
