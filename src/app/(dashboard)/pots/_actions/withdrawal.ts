"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { BalanceDocument, PotDocument } from "@/lib/types";
import { DEMO_USER_ID } from "../../shared-data/scoped-user";

const schema = z.object({
  withdrawal: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Withdrawal amount must be a valid number")
    .transform((val) => parseFloat(val)),
});

export async function withdrawalFromPotAction(prevState: unknown, formData: FormData) {
  const potId = formData.get("pot-id") as string;
  if (!ObjectId.isValid(potId)) {
    throw new Error("Invalid pot ID");
  }

  const rawData = formData.get("withdrawal") as string;
  try {
    const parsedData = schema.safeParse({ withdrawal: rawData });
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0].message);
    }

    const withdrawalAmount = parsedData.data.withdrawal;

    const { db } = await connectToDatabase();
    const potsCol = db.collection<PotDocument>("pots");
    const balancesCol = db.collection<BalanceDocument>("balances");

    try {
      const potRes = await potsCol.updateOne(
        { userId: DEMO_USER_ID, _id: new ObjectId(potId), total: { $gte: withdrawalAmount } },
        { $inc: { total: -withdrawalAmount } },
      );

      if (potRes.modifiedCount !== 1) {
        throw new Error("Insufficient funds in pot for this withdrawal");
      }

      const balanceRes = await balancesCol.updateOne(
        { userId: DEMO_USER_ID },
        { $inc: { current: withdrawalAmount } },
      );
      if (balanceRes.modifiedCount !== 1) {
        // Rollback pot update if balance update fails
        await potsCol.updateOne(
          { userId: DEMO_USER_ID, _id: new ObjectId(potId) },
          { $inc: { total: withdrawalAmount } },
        );
        throw new Error("Failed to update balance with withdrawal amount");
      }
    } catch (error) {
      console.error("Withdrawal transaction error:", error);
      throw error;
    }

    revalidatePath("/pots");
    revalidatePath("/overview");
    return { success: true, message: `Successfully withdrew ${withdrawalAmount} from your pot` };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
