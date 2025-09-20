import ProjectsGallery from "@/components/ProjectsGallery";
import { getProjects } from "@/lib/projects";
import Script from "next/script";

type SearchParams = Record<string, string | string[] | undefined>;

type EmbedProjectsPageProps = {
  searchParams?: SearchParams;
};

const RESIZE_SCRIPT = `
(function () {
  if (!window.parent) {
    return;
  }

  const MESSAGE_TYPE = "sp-gallery:height";

  const getHeight = () => {
    const doc = document.documentElement;
    const body = document.body;
    return Math.max(
      doc ? doc.scrollHeight : 0,
      body ? body.scrollHeight : 0,
      window.innerHeight || 0
    );
  };

  const postHeight = () => {
    const height = getHeight();
    window.parent.postMessage({ type: MESSAGE_TYPE, height }, "*");
  };

  let resizeTimeout;
  const requestPostHeight = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(postHeight, 50);
  };

  window.addEventListener("load", postHeight);
  window.addEventListener("resize", requestPostHeight);

  if (typeof MutationObserver === "function") {
    const observer = new MutationObserver(requestPostHeight);
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  postHeight();
})();
`;

export default async function EmbedProjectsPage({ searchParams }: EmbedProjectsPageProps) {
  const categoryParam = searchParams?.category;
  const limitParam = searchParams?.limit;

  const category = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const limitValue = Array.isArray(limitParam) ? limitParam[0] : limitParam;
  const trimmedCategory = category?.trim();
  const parsedLimit = limitValue ? Number.parseInt(limitValue, 10) : Number.NaN;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

  const projects = await getProjects({
    category: trimmedCategory,
    limit,
  });

  return (
    <>
      <Script id="sp-gallery-embed-resize" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: RESIZE_SCRIPT }} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <ProjectsGallery projects={projects} />
      </main>
    </>
  );
}