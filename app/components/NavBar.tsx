// app/components/NavBar.tsx  — SERVER COMPONENT, no "use client"
import { QueenofheartsService } from '@qoh/core-react';
import NavShell from './NavShell';

export default async function NavBar() {
  QueenofheartsService.init(
    process.env.HEADLESSLI_TOKEN ?? '',
    process.env.QOH_SERVER_URL,
  );

  let pages: { slug: string; title: string }[] = [];
  try {
    const res = await QueenofheartsService.getInstance().queryGraphql(
      '{allPages{slug title}}',
    );
    pages = res?.res?.data?.allPages ?? [];
  } catch {
    // Server unreachable during build — render empty nav
  }

  return <NavShell pages={pages} />;
}