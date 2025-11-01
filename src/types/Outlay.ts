export interface Expense {
	title: string;
	category: string;
	price: number;
	date: Date;
}

export type ExpenseWithId = Expense & {
	id: string;
};
