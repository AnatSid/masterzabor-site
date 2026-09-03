"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type ProjectCardProps = {
  project: Project;
  className?: string;
  priority?: boolean;
};

function getProjectFacts(project: Project) {
  return [
    { label: "Длина", value: project.length },
    { label: "Высота", value: project.height },
    { label: "Бюджет", value: project.priceRange },
    { label: "Срок", value: project.completedAt },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));
}

export function ProjectCard({
  project,
  className,
  priority = false,
}: ProjectCardProps) {
  const facts = getProjectFacts(project);

  return (
    <article
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        className ?? ""
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          alt={project.mainPhoto.alt}
          className="object-cover"
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={project.mainPhoto.src}
          style={{ objectPosition: project.mainPhoto.objectPosition ?? "center" }}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0A5633] shadow-sm">
            {project.categoryLabel}
          </span>
          <span className="rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white">
            {project.city.name}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight text-slate-950">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {project.description}
        </p>

        {facts.length > 0 ? (
          <dl className="mt-5 grid min-w-0 gap-3 border-t border-slate-100 pt-4 text-sm">
            {facts.map((fact) => (
              <div
                className="grid min-w-0 gap-1 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-3"
                key={fact.label}
              >
                <dt className="font-semibold text-slate-500">{fact.label}</dt>
                <dd className="min-w-0 break-words text-slate-800">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {project.serviceSlug ? (
          <div className="mt-auto pt-5">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0A5633] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#06321F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5633] focus-visible:ring-offset-2"
              href={`/${project.serviceSlug}`}
            >
              Подробнее
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
