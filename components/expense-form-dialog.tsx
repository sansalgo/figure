"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { colorNames, currencies, currencyIcons } from "@/constants";
import {
  type Expense,
  ExpenseFormSchema,
  type ExpenseFormValues,
  type Tag,
  type TagFormValues,
} from "@/types";
import { CalendarIcon, CheckIcon, PlusIcon, XIcon } from "@phosphor-icons/react";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  onSubmit: (values: ExpenseFormValues) => void;
  tags: Tag[];
  onAddTag: (tag: TagFormValues) => Tag;
  initialValues?: Expense;
  isEditMode?: boolean;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  currency,
  tags,
  onAddTag,
  initialValues,
  isEditMode = false,
}: ExpenseFormDialogProps) {
  const CurrencyIcon = currencyIcons[currency];
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: initialValues || {
      name: "",
      amount: 0,
      currency: currencies[0],
      date: new Date(),
      tagId: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name ?? "",
        amount: initialValues.amount ?? 0,
        currency: initialValues.currency ?? currencies[0],
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
        tagId: initialValues.tagId ?? "",
      });
    }
  }, [initialValues, form]);

  const handleAddTag = () => {
    if (newTagName) {
      const newTag = onAddTag({ name: newTagName, color: colorNames[0] });
      form.setValue("tagId", newTag.id);
      setNewTagName("");
      setIsAddingTag(false);
    }
  };

  const handleCancelAddTag = () => {
    setNewTagName("");
    setIsAddingTag(false);
  };

  const handleFormSubmit = (values: ExpenseFormValues) => {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of your expense"
              : "Enter the details of your expense"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Expense Name</FieldLabel>
                <Input
                  placeholder="Lunch, Taxi, etc."
                  {...field}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="amount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Amount</FieldLabel>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground flex items-center">
                    <CurrencyIcon className="h-4 w-4" />
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseFloat(e.target.value) || 0)
                    }
                    value={field.value || ""}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col"
              >
                <FieldLabel>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid gap-2">
            <Label>Tag</Label>
            {isAddingTag ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddTag}
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCancelAddTag}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Controller
                control={form.control}
                name="tagId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id}>
                              {tag.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsAddingTag(true)}
                        title="Add new tag"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? "Update Expense" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
