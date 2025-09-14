"use server";

import { z } from "zod";
import connectToDatabase from "@/lib/db";
import { ThemeColor, PotDocument } from "@/lib/types";
import { themeColors } from "@/lib/config";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z
    .string()
    .refine((val) => val.trim() !== "", { error: "Name cannot be empty" })
    .max(30, { error: "Name must be 30 characters or less" }),
  target: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      error: "Enter a valid amount, like 2000 or 2000.00",
    })
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) {
        throw new Error("Target must be a positive number");
      }
      return num;
    }),
  theme: z.string({ error: "Invalid theme selected" }),
});

export async function createPotAction(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    target: formData.get("target") as string,
    theme: formData.get("theme") as ThemeColor,
  };

  try {
    const { success, data, error } = schema.safeParse(rawData);
    if (!success) {
      throw new Error(error.issues.map((err) => err.message)[0] || "Validation failed");
    }

    const theme = themeColors[data.theme as keyof typeof themeColors];
    const newPot = {
      name: data.name,
      target: data.target,
      total: 0,
      theme,
      createdAt: new Date(),
    };

    const { db } = await connectToDatabase();
    const collection = db.collection<PotDocument>("pots");
    const result = await collection.insertOne(newPot);

    if (!result.acknowledged) {
      throw new Error("Failed to create new pot");
    }

    revalidatePath("/pots");
    revalidatePath("/overview");
    return {
      success: true,
      message: "Pot created successfully",
    };
  } catch (error) {
    console.error("Error creating pot:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
