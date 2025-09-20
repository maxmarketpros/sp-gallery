"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import Lightbox from "./Lightbox";
import ProjectCard from "./ProjectCard";

type ProjectsGalleryProps = {
  projects: Project[];
};

export default function ProjectsGallery({ projects }: ProjectsGalleryProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeProject = useMemo(() => {
    if (activeProjectIndex === null) {
      return null;
    }

    return projects[activeProjectIndex] ?? null;
  }, [activeProjectIndex, projects]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (activeProjectIndex === null) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "sp-gallery:lightbox-close" }, "*");
      }
      return;
    }

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "sp-gallery:lightbox-open" }, "*");
    }
  }, [activeProjectIndex]);

  const openProject = useCallback((index: number) => {
    setActiveProjectIndex(index);
    setActiveImageIndex(0);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveProjectIndex(null);
    setActiveImageIndex(0);
  }, []);

  const showNextImage = useCallback(() => {
    setActiveImageIndex((current) => {
      if (activeProjectIndex === null) {
        return current;
      }

      const project = projects[activeProjectIndex];
      if (!project) {
        return current;
      }

      return (current + 1) % project.images.length;
    });
  }, [activeProjectIndex, projects]);

  const showPreviousImage = useCallback(() => {
    setActiveImageIndex((current) => {
      if (activeProjectIndex === null) {
        return current;
      }

      const project = projects[activeProjectIndex];
      if (!project) {
        return current;
      }

      return (current - 1 + project.images.length) % project.images.length;
    });
  }, [activeProjectIndex, projects]);

  if (projects.length === 0) {
    return <p className="text-sm text-gray-500">No projects with images were found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} onClick={() => openProject(index)} />
        ))}
      </div>
      <Lightbox
        project={activeProject}
        isOpen={activeProject !== null}
        imageIndex={activeImageIndex}
        onClose={closeLightbox}
        onNext={showNextImage}
        onPrev={showPreviousImage}
      />
    </>
  );
}