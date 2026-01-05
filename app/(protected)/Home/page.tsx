import HomeClient from "./_components/HomeClient";
import { StatsSection } from "./_components/StatsSection";
import { getAuthUserId } from "@/lib/auth";
import { IProject } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    assignedProjects: projects.filter((p) => p.assignedUsers?.length).length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalTasks: projects.reduce((sum, p) => sum + (p.Tasks?.length || 0), 0),
  };

  const latestProject = [...projects].sort(
    (a, b) =>
      new Date(b.createdAt ?? "").getTime() -
      new Date(a.createdAt ?? "").getTime()
  )[0];

  const lastUpdatedProject = [...projects]
    .filter((p) => p.updatedAt)
    .sort(
      (a, b) =>
        new Date(b.updatedAt ?? 0).getTime() -
        new Date(a.updatedAt ?? 0).getTime()
    )[0];

  return (
    <div className="h-full p-1 bg-background md:p-1 md:overflow-hidden">
      <main className="w-full mx-auto pt-1 flex-1">
        <StatsSection stats={stats} />
        <HomeClient
          initialProjects={projects}
          latestProject={latestProject}
          lastUpdatedProject={lastUpdatedProject}
        />
      </main>
    </div>
  );
}
