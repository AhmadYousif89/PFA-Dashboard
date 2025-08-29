"use client";

import { useState } from "react";

export const useCurrencyInput = (defaultValue: number | string = "") => {
  const [value, setValue] = useState(String(defaultValue) || "");
  const [error, setError] = useState(false);

  const validateInput = (inputValue: string) => {
    return /^\d+(\.\d{1,2})?$/.test(inputValue) || inputValue === "";
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleInvalid = (
    e: React.InvalidEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>,
    errorMessage: string,
  ) => {
    setError(true);
    e.currentTarget.setCustomValidity(errorMessage);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setError(false);
    e.currentTarget.setCustomValidity("");
  };

  const isValid = validateInput(value) && !error;

  return {
    value,
    error,
    isValid,
    handleValueChange,
    handleInvalid,
    handleInput,
  };
};
