"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
  values: {
    first: {
      value: string;
      title: string;
    };
    second: {
      value: string;
      title: string;
    };
  };
  param: string;
  cookieName: string;
  current?: string;
}

export function ToggleButton({ values, param, cookieName, current }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeToggle = searchParams.get(param);

  const leftToggle = values.first.value;
  const rightToggle = values.second.value;

  const handleSetValue = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(param, value);
      document.cookie = `${cookieName}=${value}; path=/; max-age=31536000; samesite=lax`;
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, param, cookieName, pathname, router],
  );

  if (activeToggle !== leftToggle && activeToggle !== rightToggle) {
    return <button>Ошибка</button>;
  }

  return (
    <div className="flex rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-1">
      <button
        onClick={() => handleSetValue(leftToggle)}
        disabled={activeToggle === leftToggle}
        className={[
          "rounded px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
          activeToggle === leftToggle
            ? "bg-surface-variant text-on-surface"
            : "text-on-surface-variant hover:text-on-surface",
          leftToggle === current && "text-primary",
        ].join(" ")}
      >
        {values.first.title}
      </button>

      <button
        onClick={() => handleSetValue(rightToggle)}
        disabled={activeToggle === rightToggle}
        className={[
          "rounded px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
          activeToggle === rightToggle
            ? "bg-surface-variant text-on-surface"
            : "text-on-surface-variant hover:text-on-surface",
          rightToggle === current && "text-primary",
        ].join(" ")}
      >
        {values.second.title}
      </button>
    </div>
  );
}
