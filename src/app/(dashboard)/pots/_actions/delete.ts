"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { BalanceDocument, PotDocument } from "@/lib/types";
import { DEMO_USER_ID } from "../../shared-data/scoped-user";

export async function deletePotAction(prevState: unknown, potId: string) {
  if (!potId) throw new Error("Missing pot ID");
  if (!ObjectId.isValid(potId)) throw new Error("Invalid pot ID format");

  try {
    const { db } = await connectToDatabase();
    const poCol = db.collection<PotDocument>("pots");
    const balancesCol = db.collection<BalanceDocument>("balances");

    try {
      const pot = await poCol.findOneAndDelete({ userId: DEMO_USER_ID, _id: new ObjectId(potId) });
      if (!pot) {
        return { success: false, message: "Pot not found" };
      }

      const potTotal = pot.total || 0;

      if (potTotal > 0) {
        const balanceRes = await balancesCol.updateOne(
          { userId: DEMO_USER_ID },
          { $inc: { current: potTotal } },
        );
        if (balanceRes.modifiedCount !== 1) {
          // Rollback pot deletion if balance update fails
          await poCol.insertOne(pot);
          return { success: false, message: "Failed to refund pot total to balance" };
        }
      }
    } catch (error) {
      console.error("Transaction error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Transaction failed",
      };
    }

    revalidatePath("/pots");
    revalidatePath("/overview");
    return { success: true, message: "Pot deleted successfully" };
  } catch (error) {
    console.error("Delete pot action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
