import { fetchUserProjects } from "@/actions/serverAtctions";
import HomeClient from "./_components/HomeClient";
import { StatsSection } from "./_components/StatsSection";
import { getAuthUserId } from "@/lib/auth";
import { Project } from "@/types/types";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const userId = await getAuthUserId();

  let projects = [];

  try {
    projects = await fetchUserProjects(userId);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }

  // Calculate static stats safely
  const stats = {
    totalProjects: projects.length,
    assignedProjects: projects.filter((p: Project) => p.assignedUsers?.length)
      .length,
    activeProjects: projects.filter((p: Project) => p.status === "active")
      .length,
    totalTasks: projects.reduce(
      (sum: number, p: Project) => sum + (p.Tasks?.length || 0),
      0
    ),
  };

  const latestProject = [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
