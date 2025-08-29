"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { BalanceDocument, PotDocument } from "@/lib/types";

export async function deletePotAction(prevState: unknown, potId: string) {
  if (!potId) throw new Error("Missing pot ID");
  if (!ObjectId.isValid(potId)) throw new Error("Invalid pot ID format");

  try {
    const { db } = await connectToDatabase();
    const poCol = db.collection<PotDocument>("pots");
    const balancesCol = db.collection<BalanceDocument>("balances");

    try {
      const pot = await poCol.findOne({ _id: new ObjectId(potId) });
      if (!pot) {
        return { success: false, message: "Pot not found" };
      }

      const potTotal = pot.total || 0;

      const deleteRes = await poCol.deleteOne({ _id: new ObjectId(potId) });
      if (deleteRes.deletedCount !== 1) {
        return { success: false, message: "Failed to delete pot" };
      }

      if (potTotal > 0) {
        const balanceRes = await balancesCol.updateOne({}, { $inc: { current: potTotal } });
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
