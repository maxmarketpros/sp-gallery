import projectsData from "@/data/projects.json" assert { type: "json" };

export type Project = {
  slug: string;
  title: string;
  category: string;
  cover: string;
  images: string[];
  count: number;
};

export type GetProjectsOptions = {
  category?: string;
  limit?: number;
};

const PROJECTS: readonly Project[] = (projectsData as Project[]).map((project) => ({
  ...project,
  images: [...project.images],
}));

function cloneProjects(projects: readonly Project[]): Project[] {
  return projects.map((project) => ({
    ...project,
    images: [...project.images],
  }));
}

export async function getProjects(options: GetProjectsOptions = {}): Promise<Project[]> {
  const { category, limit } = options;

  let filtered: readonly Project[] = PROJECTS;

  if (category) {
    const normalizedCategory = category.trim().toLowerCase();
    filtered = filtered.filter((project) => project.category.toLowerCase() === normalizedCategory);
  }

  if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return cloneProjects(filtered);
}