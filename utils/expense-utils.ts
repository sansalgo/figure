import { format, isSameMonth } from "date-fns";
import type {
  Expense,
  ExpenseGroupByDate,
  ExpenseGroupByTag,
  Tag,
} from "@/types";
import { currencies } from "@/constants";

export function groupExpensesByDate(expenses: Expense[]): ExpenseGroupByDate[] {
  const grouped: Record<string, Expense[]> = {};

  expenses.forEach((expense) => {
    const dateKey = format(new Date(expense.date), "yyyy-MM-dd");
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(expense);
  });

  return Object.entries(grouped).map(([date, expenses]) => ({
    key: date,
    label: format(new Date(date), "MMMM d, yyyy"),
    expenses,
    total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    currency: expenses[0]?.currency || currencies[0],
  }));
}

export function groupExpensesByTag(
  expenses: Expense[],
  tags: Tag[]
): ExpenseGroupByTag[] {
  const grouped: Record<string, Expense[]> = {};

  expenses.forEach((expense) => {
    const { tagId } = expense;
    if (!grouped[tagId]) {
      grouped[tagId] = [];
    }
    grouped[tagId].push(expense);
  });

  return Object.entries(grouped).map(([tagId, expenses]) => {
    const tag = tags.find((t) => t.id === tagId);
    return {
      key: tagId,
      label: tag?.name || "Uncategorized",
      color: tag?.color,
      expenses,
      total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      currency: expenses[0]?.currency || currencies[0],
    };
  });
}

export function filterExpensesByMonth(
  expenses: Expense[],
  date: Date
): Expense[] {
  return expenses.filter((expense) =>
    isSameMonth(new Date(expense.date), date)
  );
}
