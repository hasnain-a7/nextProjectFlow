"use client";
import { Suspense, lazy } from "react";
import Loader from "@/components/Loader";
import { notFound, useParams } from "next/navigation";
import { useProjectContext } from "@/app/context/projectContext";
const TaskAccordionTable = lazy(
  () => import("@/components/ProjectAccordionTable")
);

const ProjectPage = () => {
  const params = useParams();
  const rawProjectId = params?.projectId;
  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  const { projects, loading } = useProjectContext();
  const project = projects.find((proj) => proj.id === projectId);
  const specificTasks = project?.Tasks ?? [];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!project) {
    notFound();
  }
  return (
    <div className="min-h-screen w-full flex flex-col space-y-4 bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<Loader />}>
          <TaskAccordionTable
            tasks={specificTasks}
            loading={loading}
            projectId={projectId}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectPage;
