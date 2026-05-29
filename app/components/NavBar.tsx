import { QueenofheartsService } from "@qoh/core-react";
import Link from "next/link";

export default async function NavBar() {
  QueenofheartsService.init(
    process.env.HEADLESSLI_TOKEN ?? "",
    process.env.QOH_SERVER_URL,
  );

  let pages: { slug: string; title: string }[] = [];
  try {
    const res = await QueenofheartsService.getInstance().queryGraphql(
      "{allPages{slug title}}",
    );
    pages = res?.res?.data?.allPages ?? [];
  } catch {
  }

  return (
    <nav className="flex flex-wrap gap-4 px-6 py-4 bg-gray-100 border-b">
      <Link href="/" className="font-bold text-blue-700">
        Home
      </Link>
      {pages.map((p) =>
        p.slug !== "homepage" ? (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="text-gray-700 hover:text-blue-700"
          >
            {p.title}
          </Link>
        ) : null,
      )}
    </nav>
  );
}
