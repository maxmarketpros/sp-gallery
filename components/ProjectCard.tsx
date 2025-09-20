"use client";

import Image from "next/image";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  onClick: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const photoCountLabel = project.count === 1 ? "1 photo" : `${project.count} photos`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={project.cover}
          alt={`${project.title} cover photo`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-sm font-medium text-blue-600">{project.category}</div>
        <div className="text-lg font-semibold text-gray-900">{project.title}</div>
        <div className="mt-auto text-sm text-gray-500">{photoCountLabel}</div>
      </div>
    </button>
  );
}
