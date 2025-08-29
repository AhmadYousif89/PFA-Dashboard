"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { BalanceDocument, PotDocument } from "@/lib/types";

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
        { current: { $gte: depositAmount } },
        { $inc: { current: -depositAmount } },
      );

      if (decRes.modifiedCount !== 1) {
        return { success: false, message: "Insufficient funds in balance" };
      }

      const potRes = await potsCol.updateOne({ _id: new ObjectId(potId) }, [
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
        await balancesCol.updateOne({}, { $inc: { current: depositAmount } });
        return { success: false, message: "Failed to update pot" };
      }
    } catch (error) {
      console.error("Deposit transaction error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Transaction failed",
      };
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
