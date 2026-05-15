"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { format, isAfter, setMonth, setYear, startOfMonth } from "date-fns";

interface MonthNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthNavigation({ currentDate, onDateChange }: MonthNavigationProps) {
  const date = new Date(currentDate);
  const [open, setOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(date.getFullYear());
  const now = new Date();

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(setYear(startOfMonth(new Date()), pickerYear), monthIndex);
    if (!isAfter(newDate, now)) {
      onDateChange(newDate);
      setOpen(false);
    }
  };

  const handleYearPrev = () => setPickerYear((y) => y - 1);
  const handleYearNext = () => {
    if (pickerYear < now.getFullYear()) setPickerYear((y) => y + 1);
  };

  return (
    <div className="flex items-center">
      <CardTitle className="text-xl font-bold">
        <Popover
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (o) setPickerYear(date.getFullYear());
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">
              {format(date, "MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" size="icon" onClick={handleYearPrev}>
                  <CaretLeftIcon className="h-4 w-4" />
                </Button>
                <span className="font-medium">{pickerYear}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleYearNext}
                  disabled={pickerYear >= now.getFullYear()}
                >
                  <CaretRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((month, index) => {
                  const monthDate = setMonth(setYear(startOfMonth(new Date()), pickerYear), index);
                  const isFuture = isAfter(monthDate, now);
                  const isSelected =
                    date.getMonth() === index &&
                    date.getFullYear() === pickerYear;
                  return (
                    <Button
                      key={month}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      disabled={isFuture}
                      onClick={() => handleMonthSelect(index)}
                      className="w-full"
                    >
                      {month}
                    </Button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardTitle>
    </div>
  );
}
