"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import SpinnerIcon from "public/assets/images/icon-spinner.svg";

import { buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";

export interface ButtonWithFormStateProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loadingText?: string;
  externalLoading?: boolean;
}

export const ButtonWithFormState = ({
  className,
  children,
  disabled,
  loadingText,
  externalLoading = false,
  ...props
}: ButtonWithFormStateProps) => {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending || externalLoading;
  const isLoading = pending || externalLoading;

  return (
    <Button type="submit" disabled={isDisabled} className={cn(className)} {...props}>
      {isLoading ? (
        <>
          <SpinnerIcon className="fill-muted size-6 animate-spin" />
          <span className="text-sm">{loadingText || "Processing"}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};
