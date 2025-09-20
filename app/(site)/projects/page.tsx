import ProjectsGallery from "@/components/ProjectsGallery";
import { getProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
        <p className="max-w-3xl text-base text-gray-600">
          Explore a curated selection of recent work spanning civil engineering, residential builds, and commercial developments.
        </p>
      </header>
      <ProjectsGallery projects={projects} />
    </main>
  );
}
