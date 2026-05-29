import {
  QueenofheartsService,
  QueenofheartsRenderComponent,
  fetchDynamicComponents,
  Filter,
} from "@qoh/core-react";
import { registerComponents } from "../../registerComponents";

async function getCMSPage(slug: string) {
  QueenofheartsService.init(
    process.env.HEADLESSLI_TOKEN ?? "",
    process.env.QOH_SERVER_URL ?? undefined,
  );
  registerComponents();

  const service = QueenofheartsService.getInstance();
  const response = await service.query("Page", {
    filter: [{ name: "slug", operator: Filter.eq, value: slug }],
  });

  const pageData = response?.Page;
  if (pageData) {
    await fetchDynamicComponents(pageData);
    return pageData;
  }
  return null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  const slug = route ? route.join("/") : "homepage";

  let pageData: any = null;
  let errorMessage: string | null = null;
  try {
    pageData = await getCMSPage(slug);
  } catch (e: any) {
    errorMessage = e?.message ?? String(e);
    console.error("[headlessli] getCMSPage failed:", errorMessage);
  }

  if (!pageData) {
    if (process.env.NODE_ENV === "development" && errorMessage) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace", color: "red" }}>
          <strong>QOH Error for &quot;{slug}&quot;:</strong>
          <pre>{errorMessage}</pre>
        </div>
      );
    }
    return <div>Page not found</div>;
  }

  return (
    <main>
      <QueenofheartsRenderComponent data={pageData} />
    </main>
  );
}
