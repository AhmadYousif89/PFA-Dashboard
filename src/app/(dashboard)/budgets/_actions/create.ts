"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { themeColors, CATEGORY_SLUGS } from "@/lib/config";
import { BudgetDocument, ThemeColor, TransactionCategory } from "@/lib/types";
import { DEMO_USER_ID } from "../../shared-data/scoped-user";

const schema = z.object({
  category: z.enum(CATEGORY_SLUGS, { error: "Invalid category selected" }),
  maximum: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      error: "Enter a valid amount, like 2000 or 2000.00",
    })
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) {
        throw new Error("Maximum must be a positive number");
      }
      return num;
    }),
  theme: z.string({ error: "Invalid theme selected" }),
});

export async function createBudgetAction(prevState: unknown, formData: FormData) {
  const rawData = {
    category: formData.get("category") as TransactionCategory,
    maximum: formData.get("maximum") as string,
    theme: formData.get("theme") as ThemeColor,
  };

  try {
    const { success, data, error } = schema.safeParse(rawData);
    if (!success) {
      throw new Error(error.issues.map((err) => err.message).join(", ") || "Validation failed");
    }

    const theme = themeColors[data.theme as keyof typeof themeColors];
    const newBudget = {
      category: data.category as TransactionCategory,
      maximum: data.maximum,
      theme,
      createdAt: new Date(),
    };

    const { db } = await connectToDatabase();
    const collection = db.collection<BudgetDocument>("budgets");
    const result = await collection.insertOne({ userId: DEMO_USER_ID, ...newBudget });

    if (result.acknowledged) {
      revalidatePath("/budgets");
      revalidatePath("/overview");
      return {
        success: true,
        message: "Budget created successfully",
      };
    } else {
      throw new Error("Failed to create new budget");
    }
  } catch (error) {
    console.error("Create budget action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
