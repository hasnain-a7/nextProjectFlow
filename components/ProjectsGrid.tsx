import { fetchUserProjects } from "@/actions/serverAtctions";

import { getAuthUserId } from "@/lib/auth";

import { Project } from "@/types/types";
import Projectlist from "./Projectlist";

export async function StreamingProjectsGrid() {
  const userId = await getAuthUserId();

  let projects: Project[] = [];

  if (userId) {
    projects = await fetchUserProjects(userId);
  }

  if (!projects || projects.length == 0) {
    return (
      <p className="text-muted-foreground text-center col-span-full pt-12">
        No projects found. Add new projects to get started.
      </p>
    );
  }

  return (
    <div className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <Projectlist projects={projects} />
    </div>
  );
}

export function ProjectsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full h-40 md:h-48 lg:h-40 xl:h-48 2xl:h-48 rounded-lg bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}
