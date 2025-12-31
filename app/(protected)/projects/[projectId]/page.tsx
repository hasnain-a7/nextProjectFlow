import { notFound } from "next/navigation";
import TaskAccordionTable from "@/components/ProjectAccordionTable";
import { fetchProjectById } from "@/actions/serverAtctions";

const ProjectPage = async ({
  params: maybeParams,
}: {
  params: Promise<{ projectId: string }> | { projectId: string };
}) => {
  const params = await maybeParams;
  const projectId = params.projectId;

  if (!projectId) {
    notFound();
  }

  const project = await fetchProjectById(projectId);
  console.log("Fetched project:", project);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full flex flex-col space-y-4 bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        <TaskAccordionTable tasks={project.tasks} project={project} />
      </div>
    </div>
  );
};

export default ProjectPage;
