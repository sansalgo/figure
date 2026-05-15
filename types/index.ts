import { z } from "zod";

// Base schemas
export const TagSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
});

export const ExpenseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Expense name is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string(),
  date: z.date(),
  tagId: z.string().min(1, "Category is required"),
});

// Form schemas
export const ExpenseFormSchema = ExpenseSchema.omit({ id: true });
export const TagFormSchema = TagSchema.omit({ id: true });

// Types derived from schemas
export type Tag = z.infer<typeof TagSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;
export type TagFormValues = z.infer<typeof TagFormSchema>;

// Group types
export type ExpenseGroupByDate = {
  key: string;
  label: string;
  expenses: Expense[];
  total: number;
  currency: string;
};

export type ExpenseGroupByTag = {
  key: string;
  label: string;
  color?: string;
  expenses: Expense[];
  total: number;
  currency: string;
};

export type TagWithTotal = Tag & {
  total: number;
  percentage: number;
};

export type ColorVariants = {
  V0: string;
  V1: string;
  V2: string;
};

export type BackupSnapshot = {
  schemaVersion: number;
  exportedAt: string;
  allExpenses: Array<Omit<Expense, "date"> & { date: string }>;
  tags: Tag[];
  currency: string;
};
