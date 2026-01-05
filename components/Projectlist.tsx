"use client";
import { Project } from "@/types/types";
import { useRouter } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
interface StreamingProjectsGridProps {
  projects: Project[];
}
const Projectlist = ({ projects }: StreamingProjectsGridProps) => {
  const navigate = useRouter();
  const handleProjectClick = (id: string) => navigate.push(`/projects/${id}`);
  return (
    <>
      {projects?.map((project: Project) => (
        <div key={project._id} className="w-full h-full">
          <ProjectCard
            projectToShow={project}
            tasks={project.Tasks || []}
            onClick={handleProjectClick}
          />
        </div>
      ))}
    </>
  );
};

export default Projectlist;
