import { PotCard } from "./pot-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPots, getPotsThemes } from "@/app/(dashboard)/shared-data/pots";

export const Pots = async () => {
  const data = await getPots();
  const selectedThemes = await getPotsThemes();

  return (
    <ScrollArea className="xl:h-(--scroll-area-max-height)">
      <article className="grid gap-6 @3xl/pots:grid-cols-[repeat(auto-fit,minmax(27rem,auto))] @7xl/pots:grid-cols-[repeat(auto-fit,minmax(40rem,auto))]">
        {data.map((pot) => (
          <PotCard key={pot.id} pot={pot} selectedThemes={selectedThemes} />
        ))}
      </article>
    </ScrollArea>
  );
};
