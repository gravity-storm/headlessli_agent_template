import { QueenofheartsRenderComponent } from "@qoh/core-react";

function ensureArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default function PageComponent({ title, paragraphs }: any) {
  const blocks = ensureArray(paragraphs);

  return (
    <main>
      <h1 className="text-4xl font-bold px-6 pt-8 pb-4">{title}</h1>
      {blocks.map((block: any, i: number) => (
        <QueenofheartsRenderComponent key={i} data={block} />
      ))}
    </main>
  );
}
