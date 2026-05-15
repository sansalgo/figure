"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { colorNames, currencies, currencyIcons, currencyNames } from "@/constants";
import { type Tag, type TagFormValues } from "@/types";
import { DriveBackupSection } from "@/components/drive-backup-section";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useExpenseStore } from "@/store/expense-store";
import {
  CheckIcon,
  DesktopIcon,
  DotsThreeIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  tags: Tag[];
  onAddTag: (tag: TagFormValues) => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (id: string) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  currency,
  onCurrencyChange,
  tags,
  onAddTag,
  onEditTag,
  onDeleteTag,
}: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editedTagName, setEditedTagName] = useState("");
  const [isTagInUseOpen, setIsTagInUseOpen] = useState(false);

  const allExpenses = useExpenseStore((state) => state.allExpenses);

  const handleDeleteTag = (id: string) => {
    const tagInUse = allExpenses.some((e) => e.tagId === id);
    if (tagInUse) {
      setIsTagInUseOpen(true);
      return;
    }
    onDeleteTag(id);
  };

  const handleStartEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setEditedTagName(tag.name);
  };

  const handleEditTag = () => {
    if (editingTag && editedTagName.trim()) {
      onEditTag({ ...editingTag, name: editedTagName });
      setEditingTag(null);
    }
  };

  const handleAddTag = () => {
    if (newTagName) {
      onAddTag({ name: newTagName, color: colorNames[0] });
      setNewTagName("");
      setIsAddingTag(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingTag(false);
    setNewTagName("");
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your expense tracker preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={onCurrencyChange}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => {
                  const CIcon = currencyIcons[c];
                  return (
                    <SelectItem key={c} value={c}>
                      <div className="flex items-center gap-2">
                        <CIcon className="h-4 w-4" />
                        <span>{currencyNames[c]}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme ?? "system"} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <SunIcon className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <MoonIcon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <DesktopIcon className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setIsAddingTag(true)}
              >
                <PlusIcon className="mr-1 h-3.5 w-3.5" /> Add Tag
              </Button>
            </div>
            <ScrollArea className="h-50 border p-2">
              <div className="divide-y">
                {isAddingTag ? (
                  <div className="flex items-center gap-2 p-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="flex-1"
                      placeholder="Tag name"
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" onClick={handleAddTag}>
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleCancelAdd}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2"
                  >
                    {editingTag && editingTag.id === tag.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editedTagName}
                          onChange={(e) => setEditedTagName(e.target.value)}
                          className="flex-1"
                          placeholder="Tag name"
                          onKeyDown={(e) => e.key === "Enter" && handleEditTag()}
                        />
                        <div className="flex gap-1">
                          <Button variant="outline" size="icon" onClick={handleEditTag}>
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span>{tag.name}</span>
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
                            <DropdownMenuItem onClick={() => handleStartEditTag(tag)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="mt-1 text-xs text-muted-foreground">
              Tags in use cannot be deleted until all associated expenses are
              reassigned or deleted
            </p>
          </div>

          <Separator />

          <DriveBackupSection />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={isTagInUseOpen} onOpenChange={setIsTagInUseOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tag in use</AlertDialogTitle>
          <AlertDialogDescription>
            This tag is assigned to one or more expenses. Reassign or delete those expenses before removing this tag.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>OK</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
