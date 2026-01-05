import { notFound } from "next/navigation";
import TaskAccordionTable from "@/components/ProjectAccordionTable";
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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${projectId}`,
    {
      cache: "no-store",
    }
  );

  const json = await res.json();
  if (!json.data) {
    notFound();
  }

  const project = json.data;

  return (
    <div className="min-h-screen w-full flex flex-col space-y-4 bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        <TaskAccordionTable tasks={project.tasks} project={project} />
      </div>
    </div>
  );
};

export default ProjectPage;
