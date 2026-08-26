"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectFilterValue } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

type PortfolioGalleryProps = {
  filters: ReadonlyArray<{ value: ProjectFilterValue; label: string }>;
  projects: Project[];
};

export function PortfolioGallery({ filters, projects }: PortfolioGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterValue>("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((item) => item.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter.value
                ? "bg-[#1B5E20] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            aria-pressed={activeFilter === filter.value}
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <ProjectCard key={item.id} priority={index === 0} project={item} />
        ))}
      </div>
    </>
  );
}
