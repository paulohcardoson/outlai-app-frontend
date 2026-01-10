import { fetchClient } from '@/lib/api-client';
import type { CreateExpenseDTO, Expense, UpdateExpenseDTO } from '@/types';

export const expensesService = {
  getAll: async (page = 1, limit = 10, category?: string): Promise<{ data: Expense[], pagination: { page: number, limit: number, total: number, totalPages: number } }> => {
    let url = `/expenses/?page=${page}&limit=${limit}`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }

    const response = await fetchClient<{
      data: Expense[],
      pagination: { page: number, limit: number, total: number, totalPages: number }
    }>(url);

    return {
      data: response.data.map(expense => ({
        ...expense,
        amount: expense.amount
      })),
      pagination: response.pagination
    };
  },

  getById: async (id: string): Promise<Expense> => {
    const expense = await fetchClient<Expense>(`/expenses/${id}`);
    return {
      ...expense,
      amount: expense.amount
    };
  },

  create: async (data: CreateExpenseDTO): Promise<Expense> => {
    const expense = await fetchClient<Expense>('/expenses/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      ...expense,
      amount: expense.amount
    };
  },

  update: async (id: string, data: UpdateExpenseDTO): Promise<Expense> => {
    const expense = await fetchClient<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return {
      ...expense,
      amount: expense.amount
    };
  },

  delete: async (id: string): Promise<void> => {
    return fetchClient(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  extractFromPhoto: async (uri: string): Promise<any> => {
    return fetchClient('/expenses/ai/extract-expenses-from-photo', {
      method: 'POST',
      body: JSON.stringify({ uri }),
    });
  },

  getTotalsByPeriod: async (startDate: string, endDate: string): Promise<Record<string, number>> => {
    return fetchClient<Record<string, number>>('/expenses/totals/period', {
      params: { startDate, endDate }
    });
  },
};
