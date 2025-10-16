"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { BalanceDocument, PotDocument } from "@/lib/types";
import { DEMO_USER_ID } from "../../shared-data/scoped-user";

const schema = z.object({
  deposit: z
    .string()
    .min(1, "Deposit amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Deposit amount must be a valid number")
    .transform((val) => parseFloat(val)),
});

export async function depositToPotAction(prevState: unknown, formData: FormData) {
  const potId = formData.get("pot-id") as string;
  if (!ObjectId.isValid(potId)) {
    throw new Error("Invalid pot ID");
  }

  const rawDeposit = formData.get("deposit") as string;
  try {
    const parsedDeposit = schema.safeParse({ deposit: rawDeposit });
    if (!parsedDeposit.success) {
      throw new Error(parsedDeposit.error.issues[0].message);
    }

    const depositAmount = parsedDeposit.data.deposit;

    try {
      const { db } = await connectToDatabase();
      const potsCol = db.collection<PotDocument>("pots");
      const balancesCol = db.collection<BalanceDocument>("balances");

      // Decrement balance.current only if enough funds
      const decRes = await balancesCol.updateOne(
        { userId: DEMO_USER_ID, current: { $gte: depositAmount } },
        { $inc: { current: -depositAmount } },
      );

      if (decRes.modifiedCount !== 1) {
        throw new Error("Insufficient balance for this deposit");
      }

      const potRes = await potsCol.updateOne({ userId: DEMO_USER_ID, _id: new ObjectId(potId) }, [
        {
          $set: {
            total: { $add: [{ $ifNull: ["$total", 0] }, depositAmount] },
            target: {
              $let: {
                vars: {
                  newTotal: { $add: [{ $ifNull: ["$total", 0] }, depositAmount] },
                  currentTarget: { $ifNull: ["$target", 0] },
                },
                in: {
                  $cond: [
                    { $gt: ["$$newTotal", "$$currentTarget"] },
                    "$$newTotal",
                    "$$currentTarget",
                  ],
                },
              },
            },
          },
        },
      ]);

      if (potRes.modifiedCount !== 1) {
        // Compensate balance if pot update failed
        await balancesCol.updateOne({ userId: DEMO_USER_ID }, { $inc: { current: depositAmount } });
        throw new Error("Failed to deposit to pot");
      }
    } catch (error) {
      console.error("Deposit transaction error:", error);
      throw error;
    }

    revalidatePath("/pots");
    revalidatePath("/overview");
    return { success: true, message: `Successfully deposited ${depositAmount} to your pot` };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
