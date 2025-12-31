import { getAuthUserId } from "@/lib/auth";
import AssignProjectsClient from "./_components/projectsclient";
import { fetchUserProjects } from "@/actions/serverAtctions";

export default async function AssignProjectsPage() {
  const userId = await getAuthUserId();

  let projects = [];

  try {
    projects = await fetchUserProjects(userId);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }

  return (
    <main className="relative min-h-screen overflow-hidden py-2">
      <div className="max-w-7xl mx-auto">
        <AssignProjectsClient initialProjects={projects} />
      </div>
    </main>
  );
}
