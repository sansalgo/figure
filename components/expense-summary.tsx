import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currencyIcons } from "@/constants";
import { type Expense, type Tag, type TagWithTotal } from "@/types";

interface ExpenseSummaryProps {
  expenses: Expense[];
  currency: string;
  tags: Tag[];
}

export function ExpenseSummary({
  expenses,
  currency,
  tags,
}: ExpenseSummaryProps) {
  const CurrencyIcon = currencyIcons[currency];
  const totalMonthlyExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const tagTotals: TagWithTotal[] = tags
    .map((tag) => {
      const tagExpenses = expenses.filter(
        (expense) => expense.tagId === tag.id
      );
      const total = tagExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const percentage =
        totalMonthlyExpense > 0 ? (total / totalMonthlyExpense) * 100 : 0;

      return {
        ...tag,
        total,
        percentage,
      };
    })
    .filter((tag) => tag.total > 0)
    .sort((a, b) => b.total - a.total);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 border border-dashed">
        <p className="text-muted-foreground">
          Click + to add your first expense
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-primary/5 border-0 mb-4 py-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Monthly Total
          </h3>
          <span className="text-xl font-bold flex items-center gap-0.5">
            <CurrencyIcon className="h-5 w-5" />
            {totalMonthlyExpense.toFixed(2)}
          </span>
        </div>

        {tagTotals.length > 0 && (
          <div className="space-y-2 mt-3">
            <Separator />
            <h4 className="text-xs font-medium text-muted-foreground mt-2">
              Top Categories
            </h4>
            <div className="space-y-1.5">
              {tagTotals.slice(0, 3).map((tag) => (
                <div key={tag.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs">{tag.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium mr-1.5 flex items-center gap-0.5">
                      <CurrencyIcon className="h-3 w-3" />
                      {tag.total.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({tag.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
