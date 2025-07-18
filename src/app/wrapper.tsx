"use client";

import { NavigationMenu } from "@/components/navigation-menu";

type Props = Readonly<{ children: React.ReactNode }>;

export default function Wrapper({ children }: Props) {
  return (
    <div className="bg-secondary mx-auto flex w-full max-w-[1440px] flex-1 flex-col xl:flex-row">
      <NavigationMenu />
      <main className="grow px-4 py-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
