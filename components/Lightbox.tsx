"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import type { Project } from "@/lib/projects";

type LightboxProps = {
  project: Project | null;
  isOpen: boolean;
  imageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Lightbox({ project, isOpen, imageIndex, onClose, onNext, onPrev }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !project) {
    return null;
  }

  const totalImages = project.images.length;
  const currentImage = project.images[imageIndex] ?? project.images[0];

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const firstTouch = event.touches[0];
    touchStartX.current = firstTouch ? firstTouch.clientX : null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const lastTouch = event.changedTouches[0];
    if (!lastTouch) {
      touchStartX.current = null;
      return;
    }

    const deltaX = lastTouch.clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrev();
      }
    }

    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} gallery`}
      onClick={handleBackdropClick}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 pb-16 pt-16">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Close
        </button>
        <div
          className="relative flex w-full items-center justify-center rounded-lg bg-black"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={currentImage}
              alt={`${project.title} image ${imageIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-sm transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous image"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-sm transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next image"
              >
                Next
              </button>
            </>
          )}
        </div>
        <div className="px-2 text-sm text-white/80">
          <div className="text-base font-semibold text-white">{project.title}</div>
          <div>{project.category}</div>
          <div className="mt-2 text-xs uppercase tracking-wide text-white/60">
            {imageIndex + 1} / {totalImages}
          </div>
        </div>
      </div>
    </div>
  );
}