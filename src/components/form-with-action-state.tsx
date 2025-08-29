"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";

import { cn } from "@/lib/utils";

type FormState = {
  success: boolean;
  message: string;
};

type FormProps<T extends FormState> = {
  action: (state: Awaited<T>, payload: FormData) => T | Promise<T>;
  initialState: Awaited<T>;
  closeDialogRef?: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLFormElement>;

export function FormWithActionState<T extends FormState>({
  action,
  children,
  className,
  initialState,
  closeDialogRef,
  ...props
}: FormProps<T>) {
  const [state, actionFn] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success && closeDialogRef?.current) {
      closeDialogRef.current.click();
    }
  }, [state, closeDialogRef]);

  return (
    <>
      <Form action={actionFn} className={cn("flex flex-col gap-4", className)} {...props}>
        {children}
      </Form>
      {!state.success && state.message && (
        <div className="text-destructive text-center text-xs font-bold">{state.message}</div>
      )}
    </>
  );
}
