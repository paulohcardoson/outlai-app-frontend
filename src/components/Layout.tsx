import { LayoutDashboard, List, LogOut, PlusCircle, Wallet } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

interface LayoutProps {
	children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
	const { user, logout } = useAuth();
	const location = useLocation();
	const currentPath = location.pathname;

	const navItems = [
		{ path: "/", icon: LayoutDashboard, label: "Dashboard" },
		{ path: "/add", icon: PlusCircle, label: "Adicionar" },
		{ path: "/list", icon: List, label: "Extrato" },
	];

	return (
		<div className="min-h-screen bg-background text-foreground flex">
			{/* Sidebar */}
			<aside className="w-64 border-r border-border bg-card hidden md:flex flex-col sticky top-0 h-screen">
				<div className="p-6 flex items-center gap-2 border-b border-border">
					<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
						<Wallet className="h-5 w-5" />
					</div>
					<h1 className="text-xl font-bold text-primary bg-clip-text">
						OutlAI
					</h1>
				</div>
				<nav className="flex-1 p-4 space-y-2">
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={cn(
								"flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
								currentPath === item.path
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<item.icon size={20} />
							{item.label}
						</Link>
					))}
				</nav>

				<div className="p-4 mt-auto border-t border-border">
					{user && (
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-muted-foreground truncate max-w-[120px]" title={user.name}>
								Olá, <span className="text-foreground">{user.name}</span>
							</p>
							<button
								onClick={logout}
								className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
								title="Sair"
							>
								<LogOut size={18} />
							</button>
						</div>
					)}
				</div>
			</aside>

			{/* Mobile Header & Main Content */}
			<div className="flex-1 flex flex-col min-w-0">
				<header className="md:hidden border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
					<div className="container mx-auto px-4 h-16 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
								<Wallet className="h-5 w-5" />
							</div>
							<span className="font-bold">Despesas</span>
						</div>
						<nav className="flex gap-1">
							{navItems.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={cn(
										"p-2 rounded-md transition-colors",
										currentPath === item.path
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:bg-muted",
									)}
								>
									<item.icon size={20} />
								</Link>
							))}
							<button
								onClick={logout}
								className="p-2 rounded-md transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
								title="Sair"
							>
								<LogOut size={20} />
							</button>
						</nav>
					</div>
				</header>
				<main className="flex-1 container mx-auto px-4 py-4 md:p-6 max-w-7xl">
					{children}
				</main>
			</div>
		</div>
	);
}
