import fs from "fs/promises";
import path from "path";

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

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const PUBLIC_DIR = path.join(process.cwd(), "public");
const TITLE_COLLECTOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function toWebPath(filePath: string): string {
  const relative = path.relative(PUBLIC_DIR, filePath);
  const normalized = relative.split(path.sep).join("/");
  return `/${normalized}`;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .trim();
}

async function collectImages(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectImages(fullPath);
      images.push(...nested);
      continue;
    }

    if (entry.isFile() && isImageFile(entry.name)) {
      images.push(toWebPath(fullPath));
    }
  }

  images.sort((a, b) => TITLE_COLLECTOR.compare(a, b));
  return images;
}

async function loadProjectsFromDisk(): Promise<Project[]> {
  const categoryEntries = await fs.readdir(PUBLIC_DIR, { withFileTypes: true });
  const projects: Project[] = [];

  for (const categoryEntry of categoryEntries) {
    if (!categoryEntry.isDirectory()) {
      continue;
    }

    const category = categoryEntry.name;
    const categoryPath = path.join(PUBLIC_DIR, category);
    const projectEntries = await fs.readdir(categoryPath, { withFileTypes: true });

    for (const projectEntry of projectEntries) {
      if (!projectEntry.isDirectory()) {
        continue;
      }

      const projectTitle = projectEntry.name;
      const projectPath = path.join(categoryPath, projectTitle);
      const images = await collectImages(projectPath);

      if (images.length === 0) {
        continue;
      }

      const relativeProjectPath = path.relative(PUBLIC_DIR, projectPath);
      const slugParts = relativeProjectPath
        .split(path.sep)
        .map((part) => slugify(part))
        .filter(Boolean);
      const slug = slugParts.join("/");

      projects.push({
        slug: slug || slugify(projectTitle) || projectTitle,
        title: projectTitle,
        category,
        cover: images[0],
        images,
        count: images.length,
      });
    }
  }

  projects.sort((a, b) => {
    const categoryCompare = TITLE_COLLECTOR.compare(a.category, b.category);
    if (categoryCompare !== 0) {
      return categoryCompare;
    }
    return TITLE_COLLECTOR.compare(a.title, b.title);
  });

  return projects;
}

export async function getProjects(options: GetProjectsOptions = {}): Promise<Project[]> {
  const { category, limit } = options;
  let projects = await loadProjectsFromDisk();

  if (category) {
    const normalizedCategory = category.trim().toLowerCase();
    projects = projects.filter((project) => project.category.toLowerCase() === normalizedCategory);
  }

  if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
    return projects.slice(0, limit);
  }

  return projects;
}
