import DATA from "@/lib/data.json";

import PotIcon from "public/assets/images/icon-pot.svg";

export const PotsSummary = () => {
  const pots = DATA.pots.slice(0, 4);
  const total = pots.reduce((total, pot) => total + pot.total, 0);

  return (
    <div className="flex flex-col gap-5 @lg/card-content:flex-row">
      <div className="bg-secondary rounded-12 flex flex-col justify-center p-4 py-5 @lg/card-content:basis-61.75">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center">
            <PotIcon />
          </div>
          <div className="flex flex-col items-center gap-2.75">
            <h3 className="text-14 text-muted-foreground">Total Saved</h3>
            <span className="text-32">
              {total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>
      <ul className="grid grow grid-cols-2 gap-4">
        {pots.map((pot) => (
          <li key={pot.name} className="flex items-center gap-4">
            <span style={{ backgroundColor: pot.theme }} className="h-full w-1 rounded" />
            <div className="flex flex-col gap-1">
              <span className="text-12 text-muted-foreground">{pot.name}</span>
              <span className="text-14-bold">${pot.target}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
