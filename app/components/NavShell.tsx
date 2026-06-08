// app/components/NavShell.tsx  — CLIENT COMPONENT
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LIMIT = 5;

export default function NavShell({
  pages,
}: {
  pages: { slug: string; title: string }[];
}) {
  const [visible, setVisible] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setVisible(true);
      } else if (y > lastScrollY.current) {
        setVisible(false);
        setMoreOpen(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mainPages =
    pages.length > NAV_LIMIT ? pages.slice(0, NAV_LIMIT - 1) : pages;
  const overflowPages =
    pages.length > NAV_LIMIT ? pages.slice(NAV_LIMIT - 1) : [];

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-black/[0.08]",
        "bg-white/85 backdrop-blur-md",
        "transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        {mainPages.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            {p.title}
          </Link>
        ))}
        {overflowPages.length > 0 && (
          <div className="relative ml-auto">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              More <span className="text-xs">{moreOpen ? "▴" : "▾"}</span>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 min-w-[160px] rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                {overflowPages.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMoreOpen(false)}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
