import fs from "fs/promises";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const OUTPUT_DIR = path.join(ROOT_DIR, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "projects.json");
const COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function toWebPath(filePath) {
  const relative = path.relative(PUBLIC_DIR, filePath);
  const normalized = relative.split(path.sep).join("/");
  return `/${normalized}`;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .trim();
}

async function collectImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const images = [];

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

  images.sort((a, b) => COLLATOR.compare(a, b));
  return images;
}

async function loadProjects() {
  const categoryEntries = await fs.readdir(PUBLIC_DIR, { withFileTypes: true });
  const projects = [];

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
    const categoryCompare = COLLATOR.compare(a.category, b.category);
    if (categoryCompare !== 0) {
      return categoryCompare;
    }
    return COLLATOR.compare(a.title, b.title);
  });

  return projects;
}

async function main() {
  try {
    const projects = await loadProjects();
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(projects, null, 2) + "\n", "utf8");
    console.log(`Generated ${projects.length} projects -> ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
  } catch (error) {
    console.error("Failed to generate project data:", error);
    process.exitCode = 1;
  }
}

main();