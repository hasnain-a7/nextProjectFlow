"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ProjectCard";
import ProjectModol from "@/components/modols/ProjectModol";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Project } from "@/types/types";

export default function AssignProjectsClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredProjects = initialProjects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleProjectClick = (id: string) => router.push(`/projects/${id}`);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <h1 className="text-2xl font-bold">Assign Projects</h1>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="min-w-max md:min-w-[120px] flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                <span className="hidden md:inline">Add Project</span>
                <span className="md:hidden">Project</span>
              </Button>
            </DialogTrigger>
            <ProjectModol />
          </Dialog>

          <Input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:mt-0 sm:w-64 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <motion.div
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
        }}
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, delay: index * 0.05 },
                },
              }}
              whileHover={{ scale: 1.02 }}
            >
              <ProjectCard
                projectToShow={project}
                tasks={project.Tasks || []}
                onClick={() => handleProjectClick(project._id || "")}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground text-center col-span-full pt-12">
            No projects found.
          </p>
        )}
      </motion.div>
    </>
  );
}
