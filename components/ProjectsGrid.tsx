import { getAuthUserId } from "@/lib/auth";
import { IProject } from "@/types/types";
import Projectlist from "./Projectlist";

export const revalidate = 0; // never cache

export async function StreamingProjectsGrid({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Resolve search params Promise
  const params = searchParams ? await searchParams : {};
  const q = (params.q as string | undefined)?.toLowerCase() || "";
  const filter = (params.filter as string | undefined) || "all";

  // Get logged-in user
  const userId = await getAuthUserId();
  let projects: IProject[] = [];

  try {
    // Fetch projects from your API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?userId=${userId}`,
      { cache: "no-store" } // ensures always fresh data
    );

    const data = await res.json();

    if (data.success) {
      projects = data.data;
    } else {
      console.error("API returned error:", data.message);
    }
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }

  // Filter and sort projects
  let filteredProjects = [...projects];

  if (q) {
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description?.toLowerCase() || "").includes(q)
    );
  }

  if (filter === "recent") {
    filteredProjects.sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    );
  } else if (filter === "lastupdated") {
    filteredProjects.sort(
      (a, b) =>
        new Date(b.updatedAt || "").getTime() -
        new Date(a.updatedAt || "").getTime()
    );
  }

  // Handle empty results
  if (!filteredProjects || filteredProjects.length === 0) {
    return (
      <p className="text-muted-foreground text-center col-span-full pt-12">
        No projects found. Add new projects to get started.
      </p>
    );
  }

  // Pass filtered or all projects
  return (
    <div className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <Projectlist projects={filteredProjects} />
    </div>
  );
}

export function ProjectsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full h-40 md:h-48 lg:h-40 xl:h-40 2xl:h-48 rounded-lg bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}
