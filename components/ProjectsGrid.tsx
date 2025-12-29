import { Project } from "@/actions/serverAtctions";
import { ProjectCard } from "@/components/ProjectCard";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

interface StreamingProjectsGridProps {
  handleProjectClick: (id: string) => void;
}

export async function StreamingProjectsGrid({
  handleProjectClick,
}: StreamingProjectsGridProps) {
  const res = await fetch(`/api/projects`, {
    cache: "no-store", // ensures fresh data each request
  });
  const projects = await res.json();

  if (!projects || projects.length <= 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-muted-foreground text-center col-span-full pt-12"
      >
        No projects found. Add new projects to get started.
      </motion.p>
    );
  }

  return (
    <motion.div
      className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project: Project) => (
          <motion.div
            key={project._id}
            layout
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="w-full h-full"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <ProjectCard
              projectToShow={project}
              tasks={project.Tasks || []}
              onClick={handleProjectClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProjectsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <motion.div
      className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="w-full h-40 md:h-48 lg:h-40 xl:h-48 2xl:h-48 rounded-lg bg-gray-200 animate-pulse"
        />
      ))}
    </motion.div>
  );
}
