import HomeClient from "./_components/HomeClient";
import { fetchUserProjects, getUserId } from "@/actions/serverAtctions";
import { StatsSection } from "./_components/StatsSection";

export default async function HomePage() {
  const userId = await getUserId();
  const projects = await fetchUserProjects(userId);

  // Calculate static stats on the server
  const stats = {
    totalProjects: projects.length,
    assignedProjects: projects.filter((p) => p.assignedUsers?.length).length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalTasks: projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0),
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
        {/* Static Stats Section - Server Component */}
        <StatsSection stats={stats} />

        {/* Interactive Parts - Client Component */}
        <HomeClient
          initialProjects={projects}
          latestProject={latestProject}
          lastUpdatedProject={lastUpdatedProject}
        />
      </main>
    </div>
  );
}
