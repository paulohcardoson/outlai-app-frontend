import { HomeIcon, ListIcon, PlusCircleIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

export const NavBar = () => {
	const location = useLocation();

	const navItems = [
		{
			path: "/",
			icon: HomeIcon,
			label: "Início",
		},
		{
			path: "/expenses",
			icon: ListIcon,
			label: "Despesas",
		},
		{
			path: "/add",
			icon: PlusCircleIcon,
			label: "Adicionar",
		},
	];

	return (
		<nav className="flex flex-col border-r-2 px-2 py-2 gap-3">
			{navItems.map((item) => {
				const Icon = item.icon;
				const isActive = location.pathname === item.path;

				return (
					<Link
						key={item.path}
						to={item.path}
						className={cn(
							"",
							isActive
								? "text-primary"
								: "text-muted-foreground hover:text-foreground",
							"flex flex-col items-center hover:bg-muted p-2 rounded-md",
						)}
					>
						<Icon className="w-6 h-6" />
						<span className="text-xs font-medium">{item.label}</span>
					</Link>
				);
			})}
		</nav>
	);
};
