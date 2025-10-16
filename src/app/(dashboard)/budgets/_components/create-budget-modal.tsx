"use client";

import { Fragment, useRef } from "react";

import CloseIcon from "public/assets/images/icon-close-modal.svg";

import { createBudgetAction } from "../_actions/create";
import { MaxSpendingInput } from "./max-spending-input";

import { budgetCategories, getCategoryLabel, themeColors } from "@/lib/config";
import { ThemeColor, TransactionCategory } from "@/lib/types";
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
  DialogTrigger,
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

const initialState = {
  success: false,
  message: "",
};

type CreateNewBudgetProps = {
  selectedThemes: ThemeColor[];
  selectedCategories: TransactionCategory[];
};

export const BudgetCreationModal = ({
  selectedThemes,
  selectedCategories,
}: CreateNewBudgetProps) => {
  const { onTouchEnd, onInteractOutside } = useBlockOutsideInteractionOnTouch();
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  const firstAvailableCategory = budgetCategories.find((cat) => !selectedCategories.includes(cat));
  const firstAvailableTheme = Object.keys(themeColors).find(
    (theme) => !selectedThemes.includes(themeColors[theme as keyof typeof themeColors]),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="min-h-14">+ Add New Budget</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={onInteractOutside} className="md:min-w-[35rem] md:p-8">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">Add New Budget</DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          Choose a category to set a spending budget. These categories can help you monitor
          spending.
        </DialogDescription>

        <FormWithActionState
          action={createBudgetAction}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="budget-category" className="text-muted-foreground text-xs font-bold">
              Budget Category
            </Label>
            <Select required name="category" defaultValue={firstAvailableCategory}>
              <SelectTrigger
                id="budget-category"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Select Category" defaultValue={firstAvailableCategory} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {budgetCategories.map((category) => {
                  const catLabel = getCategoryLabel(category);
                  if (selectedCategories.includes(category)) {
                    return (
                      <Fragment key={category}>
                        <SelectItem value={category} disabled className="group">
                          <span>{catLabel}</span>
                          <small className="bg-popover group-data-[highlighted]:bg-accent absolute right-2 text-xs">
                            Already used
                          </small>
                        </SelectItem>
                        <SelectSeparator className="last:hidden" />
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={category}>
                      <SelectItem value={category} className="data-[state=checked]:bg-accent">
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
            <Label htmlFor="max-spend" className="text-muted-foreground text-xs font-bold">
              Maximum Spend
            </Label>
            <MaxSpendingInput required id="max-spend" name="maximum" />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="budget-theme" className="text-muted-foreground text-xs font-bold">
              Theme
            </Label>
            <Select required name="theme" defaultValue={firstAvailableTheme}>
              <SelectTrigger
                id="budget-theme"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Choose Color" defaultValue={firstAvailableTheme} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {Object.entries(themeColors).map(([key, value]) => {
                  if (selectedThemes.includes(value)) {
                    return (
                      <Fragment key={key}>
                        <SelectItem value={key} disabled>
                          <span
                            className="size-4 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span>{key}</span>
                          <small className="bg-popover absolute right-2 text-xs">
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

          <ButtonWithFormState type="submit" className="mt-1 min-h-13">
            Create Budget
          </ButtonWithFormState>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
