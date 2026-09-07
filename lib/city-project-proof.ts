import type { City } from "@/content/cities";
import type { Project } from "@/content/projects";

export const CITY_PROOF_LIMIT = 3;

export const normalizeOblastGroup = (oblast: string) =>
  oblast === "Минская область" ? "Минск и Минская область" : oblast;

function byFeaturedThenSourceOrder(left: Project, right: Project) {
  if (left.isFeatured === right.isFeatured) {
    return 0;
  }

  return left.isFeatured ? -1 : 1;
}

export function getCityProjectProof(
  city: City,
  sourceProjects: ReadonlyArray<Project>,
) {
  const currentGroup = normalizeOblastGroup(city.oblast);
  const confirmedProjects = sourceProjects.filter((project) =>
    project.id.startsWith("real-"),
  );
  const exactProjects = confirmedProjects
    .filter((project) => project.city.slug === city.slug)
    .sort(byFeaturedThenSourceOrder);
  const sameOblastProjects = confirmedProjects
    .filter(
      (project) =>
        project.city.slug !== city.slug &&
        normalizeOblastGroup(project.city.oblast) === currentGroup,
    )
    .sort(byFeaturedThenSourceOrder);
  const nationwideProjects = confirmedProjects
    .filter(
      (project) =>
        project.city.slug !== city.slug &&
        normalizeOblastGroup(project.city.oblast) !== currentGroup,
    )
    .sort(byFeaturedThenSourceOrder);
  const selectedProjects: Project[] = [];

  for (const project of [
    ...exactProjects,
    ...sameOblastProjects,
    ...nationwideProjects,
  ]) {
    if (
      selectedProjects.length < CITY_PROOF_LIMIT &&
      !selectedProjects.some((item) => item.id === project.id)
    ) {
      selectedProjects.push(project);
    }
  }

  const regionalCount = exactProjects.length + sameOblastProjects.length;
  const mode =
    exactProjects.length > 0
      ? "exact"
      : sameOblastProjects.length > 0
        ? "oblast"
        : "nationwide";

  return {
    mode,
    projects: selectedProjects,
    regionalCount,
  };
}
