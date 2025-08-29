import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import LogoSmall from "public/assets/images/logo-small.svg";
import LogoLarge from "public/assets/images/logo-large.svg";
import OverviewIcon from "public/assets/images/icon-nav-overview.svg";
import TransactionsIcon from "public/assets/images/icon-nav-transactions.svg";
import BudgetsIcon from "public/assets/images/icon-nav-budgets.svg";
import PotsIcon from "public/assets/images/icon-nav-pots.svg";
import BillsIcon from "public/assets/images/icon-nav-recurring-bills.svg";
import MinimizeIcon from "public/assets/images/icon-minimize-menu.svg";
import NarrowLayoutIcon from "public/assets/images/icon-narrow-layout.svg";
import WideLayoutIcon from "public/assets/images/icon-wide-layout.svg";

const navConfig = [
  {
    key: "overview",
    title: "Overview",
    href: "/overview",
    icon: <OverviewIcon />,
  },
  {
    key: "transactions",
    title: "Transactions",
    href: "/transactions",
    icon: <TransactionsIcon />,
  },
  {
    key: "budgets",
    title: "Budgets",
    href: "/budgets",
    icon: <BudgetsIcon />,
  },
  {
    key: "pots",
    title: "Pots",
    href: "/pots",
    icon: <PotsIcon />,
  },
  {
    key: "bills",
    title: "Recurring bills",
    href: "/bills",
    icon: <BillsIcon />,
  },
];

export const NavigationMenu = () => {
  const [navMenu, setNavMenu] = useState<"open" | "close">("open");
  const [toggleView, setToggleView] = useState(true);
  const pathname = usePathname().replace("/", "");

  return (
    <div
      className={cn(
        "ring-background/5 @container/nav overflow-hidden xl:-order-1",
        "transition-[width] duration-250 ease-in-out will-change-[width]",
        navMenu === "open" ? "xl:w-75" : "xl:w-22",
      )}
    >
      <nav
        className={cn(
          "bg-sidebar flex h-13.5 items-center justify-center rounded-t-md px-4 pt-2",
          "xl:min-h-full xl:flex-col xl:gap-6 xl:rounded-tl-none xl:rounded-br-md xl:p-0",
          "@2xl/nav:min-h-18.5 @2xl/nav:px-10",
        )}
      >
        <span className="hidden w-full py-10 pr-6 xl:block">
          <Link href="/" className="flex pl-8">
            {navMenu === "open" ? <LogoLarge /> : <LogoSmall />}
          </Link>
        </span>
        <ul
          className={cn(
            "flex size-full items-center",
            "xl:flex-col xl:gap-1 @2xl/nav:justify-between @2xl/nav:gap-4",
            "xl:transition-[padding-right] xl:duration-250 xl:ease-in-out xl:will-change-[padding]",
            navMenu === "open" ? "xl:pr-6" : "xl:pr-2",
          )}
        >
          {navConfig.map((item) => (
            <li
              key={item.key}
              className={cn(
                "group relative flex size-full items-center justify-center rounded-t-md @2xl/nav:w-26",
                "xl:h-14 xl:rounded-tl-none xl:rounded-br-md",
                "after:absolute after:bottom-0 after:h-1 after:w-full after:bg-transparent",
                "xl:after:left-0 xl:after:h-full xl:after:w-1",
                pathname === item.key && "bg-sidebar-primary after:bg-sidebar-accent",
              )}
            >
              <Link
                href={item.href}
                aria-selected={pathname === item.key}
                className={cn(
                  "flex size-full items-center justify-center",
                  "xl:justify-stretch xl:gap-4 xl:px-8 @2xl/nav:flex-col @2xl/nav:gap-1",
                )}
              >
                <span
                  className={cn(
                    pathname === item.key
                      ? "[&_path]:fill-sidebar-accent"
                      : "group-hover:[&_path]:fill-sidebar-accent-foreground group-focus-within:[&_path]:fill-sidebar-accent-foreground",
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-bold whitespace-nowrap transition duration-250 xl:block xl:text-base @2xl/nav:block",
                    pathname === item.key
                      ? "text-sidebar-primary-foreground"
                      : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground group-focus-within:text-sidebar-accent-foreground",
                    navMenu === "open" ? "xl:visible xl:opacity-100" : "xl:invisible xl:opacity-0",
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden min-h-65 w-full flex-col justify-center gap-4 px-8 xl:flex">
          <div className="group text-sidebar-foreground hover:text-sidebar-accent-foreground relative flex shrink-0 items-center gap-3 *:shrink-0">
            <button
              onClick={() => {
                setToggleView((state) => !state);
                document.documentElement.style.setProperty(
                  "--app-width",
                  toggleView ? "100vw" : "1440px",
                );
              }}
            >
              {toggleView ? <NarrowLayoutIcon /> : <WideLayoutIcon />}
              <span className="absolute inset-0 cursor-pointer" />
            </button>
            <span
              className={cn(
                "whitespace-nowrap transition duration-250",
                navMenu === "open" ? "xl:visible xl:opacity-100" : "xl:invisible xl:opacity-0",
              )}
            >
              Toggle View
            </span>
          </div>
          <div className="group text-sidebar-foreground hover:text-sidebar-accent-foreground relative flex shrink-0 items-center gap-4 *:shrink-0">
            <button onClick={() => setNavMenu((state) => (state === "open" ? "close" : "open"))}>
              <MinimizeIcon
                className={cn(
                  "group-hover:[&_path]:fill-sidebar-accent-foreground transition duration-250",
                  navMenu === "open" ? "" : "rotate-180",
                )}
              />
              <span className="absolute inset-0 cursor-pointer" />
            </button>
            <span
              className={cn(
                "whitespace-nowrap transition duration-250",
                navMenu === "open" ? "xl:visible xl:opacity-100" : "xl:invisible xl:opacity-0",
              )}
            >
              Minimize Menu
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};
