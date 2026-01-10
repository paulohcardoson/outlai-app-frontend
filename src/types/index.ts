export interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
}

export interface Expense {
    id: string;
    userId: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password?: string;
}

export interface CreateExpenseDTO {
    description: string;
    amount: number;
    category: string;
    date: string;
}

export interface UpdateExpenseDTO {
    description?: string;
    amount?: number;
    category?: string;
    date?: string;
}
