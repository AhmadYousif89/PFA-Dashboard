"use client";

import { NavigationMenu } from "@/components/navigation-menu";

type Props = Readonly<{ children: React.ReactNode }>;

export default function Wrapper({ children }: Props) {
  return (
    <div className="bg-secondary mx-auto flex w-full max-w-(--app-width) grow flex-col transition-all duration-300 will-change-contents xl:flex-row">
      <main className="xl:ring-foreground/5 flex grow flex-col overflow-hidden px-4 py-6 md:px-10 md:py-8 xl:shadow-lg xl:ring-[1px]">
        {children}
      </main>
      <NavigationMenu />
    </div>
  );
}
