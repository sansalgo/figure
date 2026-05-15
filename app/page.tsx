"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { ExpenseFormDialog } from "@/components/expense-form-dialog"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseSummary } from "@/components/expense-summary"
import { MonthNavigation } from "@/components/month-navigation"
import { SettingsDialog } from "@/components/settings-dialog"

import { useExpenseStore } from "@/store/expense-store"
import type { Expense, ExpenseFormValues } from "@/types"
import { groupExpensesByDate, groupExpensesByTag } from "@/utils/expense-utils"
import { GearIcon, PlusIcon } from "@phosphor-icons/react"

export default function Page() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [groupBy, setGroupBy] = useState<"date" | "tag">("date")

  const {
    currentDate,
    setCurrentDate,
    currentMonthExpenses: expenses,
    tags,
    currency,
    addExpense,
    updateExpense,
    deleteExpense,
    addTag,
    updateTag,
    deleteTag,
    setCurrency,
  } = useExpenseStore()

  const handleAddOrUpdateExpense = (values: ExpenseFormValues) => {
    if (isEditMode && editingExpense) {
      updateExpense(editingExpense.id, values)
      setIsEditMode(false)
      setEditingExpense(null)
    } else {
      addExpense(values)
    }
    setIsAddExpenseOpen(false)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsEditMode(true)
    setIsAddExpenseOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete)
      setExpenseToDelete(null)
    }
  }

  const groupedExpenses =
    groupBy === "date"
      ? groupExpensesByDate(expenses)
      : groupExpensesByTag(expenses, tags)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full gap-0 border shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <MonthNavigation
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false)
                    setEditingExpense(null)
                    setIsAddExpenseOpen(true)
                  }}
                  title="Add Expense"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  title="Settings"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <GearIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-0">
            <ExpenseSummary
              expenses={expenses}
              currency={currency}
              tags={tags}
            />

            {expenses.length > 0 && (
              <>
                <Tabs
                  value={groupBy}
                  className="mb-4 w-full"
                  onValueChange={(value) => setGroupBy(value as "date" | "tag")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="date">By Date</TabsTrigger>
                    <TabsTrigger value="tag">By Tag</TabsTrigger>
                  </TabsList>
                </Tabs>

                <ExpenseList
                  groupedExpenses={groupedExpenses}
                  currency={currency}
                  tags={tags}
                  groupBy={groupBy}
                  onEdit={handleEditExpense}
                  onDelete={(id) => setExpenseToDelete(id)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ExpenseFormDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onSubmit={handleAddOrUpdateExpense}
        currency={currency}
        tags={tags}
        onAddTag={addTag}
        initialValues={editingExpense || undefined}
        isEditMode={isEditMode}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        currency={currency}
        onCurrencyChange={setCurrency}
        tags={tags}
        onAddTag={addTag}
        onEditTag={updateTag}
        onDeleteTag={deleteTag}
      />

      <DeleteConfirmationDialog
        open={!!expenseToDelete}
        onOpenChange={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
