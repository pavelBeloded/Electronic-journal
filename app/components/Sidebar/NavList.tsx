"use client";
import { LinkType } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChartBar, House } from "lucide-react";

const links: LinkType[] = [
  {
    icon: House,
    href: "/",
    title: "Домашняя страница",
  },
  {
    icon: Calendar,
    href: "/schedule",
    title: "Расписание",
  },
  {
    icon: ChartBar,
    href: "/journal",
    title: "Журнал",
  },
];

export function NavList({ onClick }: { onClick: () => void }) {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="list-none flex flex-col gap-1">
        {links.map((link) => {
          const isActive =
            pathname === "/" ? link.href === "/" : pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClick}
                className={[
                  "flex items-center gap-3 rounded-md px-4 py-2 transition-all duration-200",
                  isActive
                    ? "border-l-2 border-primary bg-surface-variant text-on-surface"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                ].join(" ")}
              >
                <link.icon
                  className={isActive ? "h-5 w-5 text-primary" : "h-5 w-5"}
                />
                <span>{link.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
