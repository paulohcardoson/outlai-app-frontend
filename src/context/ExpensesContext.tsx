import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { expensesService } from '@/services/expenses';
import type { Expense, Category } from '@/types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'Comida', name: 'Comida', color: '#ef4444' },
  { id: 'Transporte', name: 'Transporte', color: '#3b82f6' },
  { id: 'Lazer', name: 'Lazer', color: '#8b5cf6' },
  { id: 'Saúde', name: 'Saúde', color: '#10b981' },
  { id: 'Educação', name: 'Educação', color: '#eab308' },
  { id: 'Outros', name: 'Outros', color: '#6b7280' },
];

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ExpensesContextType {
  expenses: Expense[];
  categories: Category[];
  pagination: Pagination;
  isLoading: boolean;
  loadExpenses: (page?: number, limit?: number, category?: string) => Promise<void>;
  addExpense: (data: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Keep track of current filters to refresh properly
  const [currentFilters, setCurrentFilters] = useState({ page: 1, limit: 10, category: 'all' });

  const loadExpenses = async (page = 1, limit = 10, category = 'all') => {
    setIsLoading(true);
    try {
      const response = await expensesService.getAll(page, limit, category);
      setExpenses(response.data);
      setPagination(response.pagination);
      setCurrentFilters({ page, limit, category });
    } catch (error) {
      console.error('Failed to load expenses', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    try {
      await expensesService.create({
        description: expense.description,
        amount: expense.amount, // Service handles division if needed, or we assume input is real value
        category: expense.category,
        date: expense.date // Date string
      });
      // Refresh current list - or go to first page
      await loadExpenses(1, currentFilters.limit, currentFilters.category);
    } catch (error) {
      console.error('Failed to add expense', error);
      throw error; // Re-throw so UI can handle (toast etc)
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expensesService.delete(id);
      // Refresh curret list
      await loadExpenses(currentFilters.page, currentFilters.limit, currentFilters.category);
    } catch (error) {
      console.error('Failed to delete expense', error);
      throw error;
    }
  };

  useEffect(() => {
    // Initial load
    loadExpenses();
  }, []);

  return (
    <ExpensesContext.Provider value={{
      expenses,
      categories,
      pagination,
      isLoading,
      loadExpenses,
      addExpense,
      deleteExpense
    }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpensesContext() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpensesContext must be used within an ExpensesProvider');
  }
  return context;
}
