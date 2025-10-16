"use client";
import { Fragment, useRef } from "react";

import { editBudgetAction } from "../_actions/update";
import { MaxSpendingInput } from "./max-spending-input";
import CloseIcon from "public/assets/images/icon-close-modal.svg";

import { cn, getThemeKey } from "@/lib/utils";
import { budgetCategories, getCategoryLabel, themeColors } from "@/lib/config";
import { Budget, ThemeColor, TransactionCategory } from "@/lib/types";
import { useBlockOutsideInteractionOnTouch } from "@/hooks/use-block-outside-interaction";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormWithActionState } from "@/components/form-with-action-state";
import { ButtonWithFormState } from "@/components/button-with-form-state";

type EditBudgetProps = {
  budget: Budget;
  selectedThemes: ThemeColor[];
  selectedCategories: TransactionCategory[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const initialState = {
  success: false,
  message: "",
};

export const EditBudgetModal = ({
  budget,
  open,
  onOpenChange,
  selectedThemes,
  selectedCategories,
}: EditBudgetProps) => {
  const { onTouchEnd, onInteractOutside } = useBlockOutsideInteractionOnTouch();
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const actualThemeColor = getThemeKey(budget.theme);

  const updateActionWrapper = (prevState: unknown, formData: FormData) => {
    formData.set("budget-id", budget.id);
    return editBudgetAction(prevState, formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={onInteractOutside} className="md:min-w-[35rem] md:p-8">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">Edit Budget</DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          As your budgets change, feel free to update your spending limits.
        </DialogDescription>

        <FormWithActionState
          action={updateActionWrapper}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <fieldset className="flex flex-col gap-1">
            <Label
              htmlFor="edit-budget-category"
              className="text-muted-foreground text-xs font-bold"
            >
              Budget Category
            </Label>
            <Select name="category" defaultValue={budget.category}>
              <SelectTrigger
                id="edit-budget-category"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Select Category" defaultValue={budget.category} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {budgetCategories.map((category) => {
                  const catLabel = getCategoryLabel(category);
                  if (selectedCategories.includes(category)) {
                    return (
                      <Fragment key={category}>
                        <SelectItem
                          disabled
                          value={category}
                          className={cn(budget.category === category && "bg-accent")}
                        >
                          <span>{catLabel}</span>
                          <small
                            className={cn(
                              "absolute right-2 text-xs",
                              budget.category === category ? "bg-accent" : "bg-transparent",
                            )}
                          >
                            Already used
                          </small>
                        </SelectItem>
                        <SelectSeparator className="last:hidden" />
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={category}>
                      <SelectItem value={category}>
                        <span>{catLabel}</span>
                      </SelectItem>
                      <SelectSeparator className="last:hidden" />
                    </Fragment>
                  );
                })}
              </SelectContent>
            </Select>
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-max-spend" className="text-muted-foreground text-xs font-bold">
              Maximum Spend
            </Label>
            <MaxSpendingInput id="edit-max-spend" defaultValue={budget.maximum} name="maximum" />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-budget-theme" className="text-muted-foreground text-xs font-bold">
              Theme
            </Label>
            <Select name="theme" defaultValue={actualThemeColor}>
              <SelectTrigger
                id="edit-budget-theme"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Choose Color" defaultValue={actualThemeColor} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {Object.entries(themeColors).map(([key, value]) => {
                  if (selectedThemes.includes(value)) {
                    return (
                      <Fragment key={key}>
                        <SelectItem
                          disabled
                          value={key}
                          className={cn(budget.theme === value && "bg-accent")}
                        >
                          <span
                            className="size-4 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span>{key}</span>
                          <small
                            className={cn(
                              "absolute right-2 text-xs",
                              budget.theme === value ? "bg-accent" : "bg-transparent",
                            )}
                          >
                            Already used
                          </small>
                        </SelectItem>
                        <SelectSeparator className="last:hidden" />
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={key}>
                      <SelectItem value={key}>
                        <span className="size-4 rounded-full" style={{ backgroundColor: value }} />
                        <span>{key}</span>
                      </SelectItem>
                      <SelectSeparator className="last:hidden" />
                    </Fragment>
                  );
                })}
              </SelectContent>
            </Select>
          </fieldset>

          <ButtonWithFormState type="submit" className="mt-1 min-h-13 w-full">
            Save Changes
          </ButtonWithFormState>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
