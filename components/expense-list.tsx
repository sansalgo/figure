"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currencyIcons } from "@/constants";
import {
  type Expense,
  type ExpenseGroupByDate,
  type ExpenseGroupByTag,
  type Tag,
} from "@/types";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface ExpenseListProps {
  groupedExpenses: (ExpenseGroupByDate | ExpenseGroupByTag)[];
  currency: string;
  tags: Tag[];
  groupBy: "date" | "tag";
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({
  groupedExpenses,
  currency,
  tags,
  groupBy,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const CurrencyIcon = currencyIcons[currency];

  if (groupedExpenses.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 border border-dashed">
        <p className="text-muted-foreground">No expenses for this period</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[50vh]">
      <div className="space-y-4 pb-4">
        {groupedExpenses.map((group) => (
          <div key={group.key} className="border overflow-hidden">
            <div className="p-3 bg-muted flex justify-between items-center">
              <span className="font-medium">{group.label}</span>
              <span className="font-semibold text-primary flex items-center gap-0.5">
                <CurrencyIcon className="h-3.5 w-3.5" />
                {group.total.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="divide-y">
              {group.expenses.map((expense) => {
                const tag = tags.find((t) => t.id === expense.tagId);
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/10"
                  >
                    <div>
                      <div className="font-medium">{expense.name}</div>
                      <div className="mt-0.5 flex items-center text-xs text-muted-foreground">
                        {groupBy === "tag" ? (
                          format(new Date(expense.date), "MMM d")
                        ) : (
                          <Badge
                            variant="outline"
                            className="h-5 py-0 text-xs font-normal"
                          >
                            {tag?.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="font-medium flex items-center gap-0.5">
                        <CurrencyIcon className="h-3.5 w-3.5" />
                        {expense.amount.toFixed(2)}
                      </div>
                      <div className="flex">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                            >
                              <DotsThreeIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onEdit(expense)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(expense.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
