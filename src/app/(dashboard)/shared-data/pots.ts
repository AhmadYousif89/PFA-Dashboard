import { cache } from "@/lib/cache";
import connectToDatabase from "@/lib/db";
import { Pot, PotDocument } from "@/lib/types";

export async function getPots({ limit = 0 } = {}) {
  return _cachedPots(limit);
}

export async function getPotsThemes() {
  const pots = await getPots();
  return pots.map((pot) => pot.theme);
}

const _cachedPots = cache(
  async (limit: number) => {
    const { db } = await connectToDatabase();
    const pots = await db
      .collection<PotDocument>("pots")
      .find({})
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    if (!pots || pots.length === 0) {
      return [];
    }

    return pots.map((pot) => ({
      id: pot._id.toString(),
      name: pot.name,
      total: pot.total,
      target: pot.target,
      theme: pot.theme,
    })) satisfies Pot[];
  },
  ["Pots"],
  { revalidate: 60 },
);

// Calculates the total amount saved across all pots
export function calcTotalPots(pots: Pot[]) {
  return pots.reduce((total, pot) => total + (pot.total || 0), 0);
}
