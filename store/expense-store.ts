import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { isSameMonth } from "date-fns";
import type { Tag, Expense, TagFormValues, BackupSnapshot } from "@/types";
import { currencies } from "@/constants";

interface ExpenseState {
  allExpenses: Expense[];
  currentMonthExpenses: Expense[];
  currentDate: Date;
  tags: Tag[];
  currency: string;
  addExpense: (expense: Omit<Expense, "id" | "currency">) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updatedExpense: Omit<Expense, "id">) => void;
  setCurrentDate: (date: Date) => void;
  addTag: (tag: TagFormValues) => Tag;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  setCurrency: (currency: string) => void;
  importState: (snapshot: BackupSnapshot) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  devtools(
    persist(
      (set, get) => ({
        allExpenses: [],
        currentMonthExpenses: [],
        currentDate: new Date(),
        tags: [],
        currency: currencies[0],

        addExpense: (expense) => {
          const { currency } = get();
          const newExpense: Expense = {
            ...expense,
            id: Date.now().toString(),
            date: expense.date,
            currency,
          };
          set((state) => {
            const updatedAllExpenses = [...state.allExpenses, newExpense];
            return {
              allExpenses: updatedAllExpenses,
              currentMonthExpenses: updatedAllExpenses.filter((exp) =>
                isSameMonth(new Date(exp.date), state.currentDate)
              ),
            };
          });
        },

        deleteExpense: (id) => {
          set((state) => {
            const updatedAllExpenses = state.allExpenses.filter(
              (expense) => expense.id !== id
            );
            return {
              allExpenses: updatedAllExpenses,
              currentMonthExpenses: updatedAllExpenses.filter((exp) =>
                isSameMonth(new Date(exp.date), state.currentDate)
              ),
            };
          });
        },

        updateExpense: (id, updatedExpense) => {
          set((state) => {
            const updatedAllExpenses = state.allExpenses.map((expense) =>
              expense.id === id ? { ...updatedExpense, id } : expense
            );
            return {
              allExpenses: updatedAllExpenses,
              currentMonthExpenses: updatedAllExpenses.filter((exp) =>
                isSameMonth(new Date(exp.date), state.currentDate)
              ),
            };
          });
        },

        setCurrentDate: (date) => {
          set((state) => ({
            currentDate: date,
            currentMonthExpenses: state.allExpenses.filter((exp) =>
              isSameMonth(new Date(exp.date), date)
            ),
          }));
        },

        addTag: (tag) => {
          const newTag: Tag = { ...tag, id: Date.now().toString() };
          set((state) => ({
            tags: [...state.tags, newTag],
          }));
          return newTag;
        },

        updateTag: (tag) => {
          set((state) => ({
            tags: state.tags.map((t) => (t.id === tag.id ? tag : t)),
          }));
        },

        deleteTag: (id) => {
          const { allExpenses } = get();
          const tagInUse = allExpenses.some((expense) => expense.tagId === id);
          if (tagInUse) return;

          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
          }));
        },

        setCurrency: (currency) => {
          set({ currency });
        },

        importState: (snapshot) => {
          const expenses: Expense[] = snapshot.allExpenses.map((e) => ({
            ...e,
            date: new Date(e.date),
          }));
          set((state) => ({
            allExpenses: expenses,
            currentMonthExpenses: expenses.filter((exp) =>
              isSameMonth(new Date(exp.date), state.currentDate)
            ),
            tags: snapshot.tags,
            currency: snapshot.currency,
          }));
        },
      }),
      {
        name: "expense-storage",
      }
    )
  )
);
