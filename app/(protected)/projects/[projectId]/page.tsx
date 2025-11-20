"use client";

import { useProjectContext } from "@/app/context/projectContext";
import TaskAccordionTable from "@/components/ProjectAccordionTable";
import Loader from "@/components/Loader";
import { useParams } from "next/navigation";

const ProjectPage = () => {
  const params = useParams();
  const rawProjectId = params?.projectId;
  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  const { projects, loading } = useProjectContext();
  const project = projects.find((proj) => proj.id === projectId);
  const specificTasks = project?.Tasks ?? [];

  return (
    <div className="min-h-screen w-full flex flex-col space-y-4 bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full py-20">
            <Loader />
          </div>
        ) : (
          <TaskAccordionTable
            tasks={specificTasks}
            loading={loading}
            projectId={projectId}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
