import { Pots } from "./_components/pots";
import { getPotsThemes } from "../shared-data/pots";
import { PotCreationModal } from "./_components/create-pot-modal";
import { ViewTransitionWrapper } from "@/components/view-transition-wrapper";

export default async function PotsPage() {
  const selectedThemes = await getPotsThemes();

  return (
    <ViewTransitionWrapper>
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Pots</h1>
          <PotCreationModal selectedThemes={selectedThemes} />
        </header>

        <section className="@container/pots">
          <Pots />
        </section>
      </div>
    </ViewTransitionWrapper>
  );
}
