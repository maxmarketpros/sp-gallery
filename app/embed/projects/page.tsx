import ProjectsGallery from "@/components/ProjectsGallery";
import { getProjects } from "@/lib/projects";

type SearchParams = Record<string, string | string[] | undefined>;

type EmbedProjectsPageProps = {
  searchParams?: SearchParams;
};

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
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <ProjectsGallery projects={projects} />
    </main>
  );
}
