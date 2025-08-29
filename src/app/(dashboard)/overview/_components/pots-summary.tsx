import { formatCurrency } from "@/lib/utils";
import { calcTotalPots, getPots } from "@/app/(dashboard)/shared-data/pots";

import PotIcon from "public/assets/images/icon-pot.svg";

export const PotsSummary = async () => {
  const pots = await getPots({ limit: 4 });
  const total = calcTotalPots(pots);

  if (pots.length === 0) {
    return <p className="text-muted-foreground text-sm">No pots available</p>;
  }

  return (
    <div className="flex flex-col gap-5 @lg/card-content:flex-row">
      <div className="bg-accent rounded-12 flex flex-col justify-center px-4 py-5 @lg/card-content:basis-61.75">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center">
            <PotIcon />
          </div>
          <div className="flex flex-col items-center gap-2.75">
            <h3 className="text-muted-foreground text-sm">Total Saved</h3>
            <span className="text-xl font-bold">
              {formatCurrency(total, { minimumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
      <ul className="grid grow grid-cols-2 gap-4">
        {pots.map((pot) => (
          <li key={pot.name} className="flex items-center gap-4">
            <span style={{ backgroundColor: pot.theme }} className="h-full w-1 rounded" />
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">{pot.name}</span>
              <span className="text-base font-bold">
                {formatCurrency(pot.total, { minimumFractionDigits: 0 })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
