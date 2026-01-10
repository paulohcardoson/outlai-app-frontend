import { expensesService } from './expenses';
import type { Expense } from '../types';

export async function processNotaFiscal(file: File): Promise<Omit<Expense, 'id'>[]> {
    console.log("Processing file:", file.name);

    try {
        const base64 = await convertFileToBase64(file);
        const result = await expensesService.extractFromPhoto(base64);

        // The API might return a single object or an array. 
        // Based on the 'extract-expenses-from-photo' name, it might be multiple.
        // Assuming the API returns { expenses: [...] } or just [...]
        // Adjusting based on common patterns, but since doc was vague on response schema,
        // we will handle a direct array or a wrapped object.

        let extracted: any[] = [];
        if (Array.isArray(result)) {
            extracted = result;
        } else if (result.expenses && Array.isArray(result.expenses)) {
            extracted = result.expenses;
        } else if (result.data && Array.isArray(result.data)) {
            extracted = result.data;
        } else {
            // If it returns a single object that looks like an expense
            extracted = [result];
        }

        // Map to Omit<Expense, 'id'>
        return extracted.map((item: any) => ({
            amount: Number(item.amount) || 0,
            description: item.description || "Despesa extraída",
            category: mapCategory(item.category),
            date: item.date || new Date().toISOString(),
            userId: "current-user", // This will be handled by backend usually, but for UI display we might need it
            createdAt: new Date().toISOString(),
        }));

    } catch (error) {
        console.error("Error processing OCR:", error);
        throw error;
    }
}

function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

function mapCategory(category: string): string {
    const validCategories = ["Comida", "Transporte", "Lazer", "Saúde", "Educação", "Outros"];
    // Simple matching or default to Outros
    const found = validCategories.find(c => c.toLowerCase() === category?.toLowerCase());
    return found || "Outros";
}
