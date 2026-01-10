import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Search, Trash2, Wallet, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { isTokenExpired } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useExpenses } from "@/store/useExpenses";

export function ExpenseList() {
	const { expenses, categories, pagination, loadExpenses, deleteExpense, isLoading } = useExpenses();
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	// Auth check
	const { logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token && isTokenExpired(token)) {
			logout();
			navigate('/login');
		}
	}, [logout, navigate]);

	// Handle initial load if needed or context handles it. 
	// Context handles initial load, but we might want to ensure we are on page 1?
	// Actually Context mounts and loads. We just listen.

	const handlePageChange = (newPage: number) => {
		loadExpenses(newPage, pagination.limit, categoryFilter);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newCategory = e.target.value;
		setCategoryFilter(newCategory);
		// Reset to page 1
		loadExpenses(1, pagination.limit, newCategory);
	};

	// Since API doesn't support search text, we will filter the *Fetched* list client-side
	// This isn't perfect (only filters current page), but better than nothing or breaking the API contract.
	// Alternatively, we could assume 'searchTerm' filters nothing if we strictly follow "server side".
	// Let's filter client side for better UX on the current page.
	const displayedExpenses = expenses.filter((expense) => {
		return expense.description.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="text-lg font-semibold">Todas as Despesas</h2>
					<span className="text-sm text-muted-foreground">
						Mostrando página {pagination.page} de {pagination.totalPages}
					</span>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={() => loadExpenses(pagination.page, pagination.limit, categoryFilter)}>
						<RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
					</Button>
				</div>
			</div>

			{/* Filters and Search Bar */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-4 md:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar nesta página..."
								className="pl-9"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex gap-4">
							<select
								className="h-10 w-full md:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								value={categoryFilter}
								onChange={handleCategoryChange}
							>
								<option value="all">Todas Categorias</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-6">
					{isLoading ? (
						<div className="flex justify-center p-8">
							<RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : (
						<>
							{displayedExpenses.length > 0 ? (
								<div className="space-y-6">
									{displayedExpenses.map((expense) => {
										const category = categories.find(
											(c) => c.id === expense.category,
										);
										return (
											<div
												key={expense.id}
												className="flex items-center justify-between group"
											>
												<div className="flex items-center gap-4 min-w-0">
													<div
														className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border"
														style={{
															backgroundColor: `${category?.color}20`,
															color: category?.color,
														}}
													>
														<Wallet className="h-5 w-5" />
													</div>
													<div className="space-y-1 min-w-0">
														<p className="font-medium leading-none truncate">
															{expense.description}
														</p>
														<div className="flex items-center gap-2 text-sm text-muted-foreground">
															<span>
																{format(typeof expense.date === 'string' ? parseISO(expense.date) : expense.date, "d MMM, yyyy", {
																	locale: ptBR,
																})}
															</span>
															<span>•</span>
															<span style={{ color: category?.color }}>
																{category?.name}
															</span>
														</div>
													</div>
												</div>
												<div className="flex items-center gap-4 flex-shrink-0 ml-4">
													<div className="font-medium text-right whitespace-nowrap">
														-{expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
													</div>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => deleteExpense(expense.id)}
														className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
														title="Excluir despesa"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
										<Search className="h-6 w-6 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-medium">Nenhuma despesa encontrada</h3>
									<p className="text-muted-foreground mt-1">
										Tente ajustar seus filtros ou busca.
									</p>
								</div>
							)}
						</>
					)}

					{/* Pagination Controls */}
					{pagination.totalPages > 1 && (
						<div className="flex items-center justify-end space-x-2 py-4 mt-4 border-t">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
								disabled={pagination.page === 1 || isLoading}
							>
								<ChevronLeft className="h-4 w-4" />
								Anterior
							</Button>
							<div className="text-sm font-medium">
								Página {pagination.page} de {pagination.totalPages}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
								disabled={pagination.page === pagination.totalPages || isLoading}
							>
								Próxima
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
