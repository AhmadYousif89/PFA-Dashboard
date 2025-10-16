"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { BudgetDocument } from "@/lib/types";
import { DEMO_USER_ID } from "../../shared-data/scoped-user";

export async function deleteBudgetAction(prevState: unknown, budgetId: string) {
  if (!budgetId) throw new Error("Missing budget ID");
  if (!ObjectId.isValid(budgetId)) throw new Error("Invalid budget ID format");

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<BudgetDocument>("budgets");
    const result = await collection.findOneAndDelete({
      userId: DEMO_USER_ID,
      _id: new ObjectId(budgetId),
    });

    if (!result) {
      throw new Error("Budget not found or already deleted");
    }

    revalidatePath("/budgets");
    revalidatePath("/overview");
    return {
      success: true,
      message: "Budget deleted successfully",
    };
  } catch (error) {
    console.error("Delete budget action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
