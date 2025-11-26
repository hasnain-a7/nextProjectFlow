"use client";
import { useMemo, useState, useDeferredValue, lazy, Suspense } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { CheckCircle, Clock, FolderOpen, Search, Plus } from "lucide-react";
import { useProjectContext, Task, Project } from "@/app/context/projectContext";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/StatsCard";
import LatestUpdatedTasks from "@/components/LatestUpdatedTasks";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Loader from "@/components/Loader";
import { UpcomingDeadlines } from "@/components/UpCommingDeadline";
import LatestProjects from "@/components/LatestProjects";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AiFeatureCard } from "@/components/AiFeaturedCard";
import { QuickNoteCard } from "@/components/QuickNoteCard";

// 1. LAZY LOAD: Only import the Modal when needed to save initial bundle size
const ProjectModol = lazy(() => import("@/components/modols/ProjectModol"));

// 2. ANIMATION VARIANTS: Define the staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each child showing up
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const HomePage = () => {
  const { projects, loading } = useProjectContext();
  const navigate = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const [filter, setFilter] = useState<"all" | "recent" | "lastupdated">("all");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const LatestProject = useMemo(() => {
    if (!projects?.length) return null;
    return [...projects].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [projects]);

  const AssignedProjects = useMemo(() => {
    return projects.filter((p) => p.assignedUsers?.length);
  }, [projects]);

  const TotalActiveProjects = useMemo(() => {
    return projects.filter((p) => p.status === "active");
  }, [projects]);

  const LastUpdatedProject = useMemo(() => {
    return [...projects]
      .filter((p) => p.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
      )[0];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const titleMatch =
        project.title ||
        project.description
          .toLowerCase()
          .includes(deferredSearch.toLowerCase());

      const categoryMatch = filteredCategory
        ? project.Category?.toLowerCase() === filteredCategory.toLowerCase()
        : true;

      const dropdownMatch =
        filter === "recent"
          ? project.id === LatestProject?.id
          : filter === "lastupdated"
          ? project.id === LastUpdatedProject?.id
          : true;

      return titleMatch && categoryMatch && dropdownMatch;
    });
  }, [
    projects,
    deferredSearch,
    filteredCategory,
    filter,
    LatestProject,
    LastUpdatedProject,
  ]);

  const Categories = useMemo(() => {
    const unique = new Set<string>();
    const result: Project[] = [];
    projects.forEach((p) => {
      if (p.Category && !unique.has(p.Category)) {
        unique.add(p.Category);
        result.push(p);
      }
    });
    return result;
  }, [projects]);

  const { totalTasks, latestTasks } = useMemo(() => {
    let total = 0;
    const allTasks: (Task & { projectId: string; projectTitle: string })[] = [];

    projects.forEach((project) => {
      const tasks = project.Tasks || [];
      total += tasks.length;

      tasks.forEach((task) => {
        if (task.updatedAt) {
          allTasks.push({
            ...task,
            projectId: project.id!,
            projectTitle: project.title,
          });
        }
      });
    });

    const sortedTasks = allTasks
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
      )
      .slice(0, 9);

    return {
      totalTasks: total,
      latestTasks: sortedTasks,
    };
  }, [projects]);

  const handleProjectClick = (id: string) => navigate.push(`/projects/${id}`);
  const handleCategoryProject = (value: string) =>
    setFilteredCategory(value === "all" ? "" : value);

  const { currentProjects, totalPages } = useMemo(() => {
    const projectsPerPage = 8;
    const total = Math.ceil(filteredProjects.length / projectsPerPage);

    const sorted = [...filteredProjects].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const current = sorted.slice(indexOfFirstProject, indexOfLastProject);

    return { currentProjects: current, totalPages: total };
  }, [filteredProjects, currentPage]);

  const handleFilterChange = (value: string) => {
    if (value === "all" || value === "recent" || value === "lastupdated") {
      setFilter(value);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="h-full p-1 bg-background md:p-1 md:overflow-hidden ">
        <main className="w-full mx-auto pt-1 flex-1 ">
          {/* Stats Section with simple fade in */}
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-1"
          >
            <div className="grid px-0.5  auto-rows-min gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
              <StatsCard
                title="Projects"
                value={projects.length}
                icon={FolderOpen}
                color="bg-gradient-to-br from-sky-600 to-sky-700"
              />
              <StatsCard
                title="Assigned Projects"
                value={AssignedProjects?.length || 0}
                icon={CheckCircle}
                color="bg-gradient-to-br from-violet-600 to-violet-700"
              />
              <StatsCard
                title="Active Projects"
                value={TotalActiveProjects?.length || 0}
                icon={Clock}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-teal-500 to-teal-600"
              />
            </div>
          </motion.section>
          <section className="flex flex-col lg:flex-row h-full w-full gap-2">
            {/* Increased gap slightly for large screens */}
            {/* --- LEFT SECTION (Main Content) --- */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2">
                {/* Header / Filter Section */}
                <div className="flex flex-col md:flex-row lg:flex-row lg:items-center lg:justify-between w-full gap-2 pt-2 shadow-sm">
                  <div className="relative flex items-center w-full sm:max-w-sm md:max-w-full lg:max-w-full xl:w-full">
                    <Search
                      className="absolute left-3 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-8 py-1 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
                    <Select
                      defaultValue="all"
                      onValueChange={handleFilterChange}
                    >
                      <SelectTrigger className="min-w-[125px]">
                        <SelectValue placeholder="All Projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="lastupdated">
                          Last Updated
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      defaultValue="all"
                      onValueChange={handleCategoryProject}
                    >
                      <SelectTrigger className="min-w-[125px]">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Categories</SelectItem>
                        {Categories.map((c) => (
                          <SelectItem key={c.id} value={c.Category}>
                            {c.Category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="default"
                          className="min-w-min md:min-w-[120px] flex items-center gap-2 font-medium whitespace-nowrap"
                        >
                          <Plus size={18} />
                          <span className="hidden md:inline">Add Project</span>
                          <span className="md:hidden">Project</span>
                        </Button>
                      </DialogTrigger>
                      <Suspense
                        fallback={
                          <div className="p-4">
                            <Loader />
                          </div>
                        }
                      >
                        <ProjectModol />
                      </Suspense>
                    </Dialog>

                    {/* Pagination Card */}
                    <Card className="hidden md:block md:bg-blend-hard-light p-0 rounded-lg sticky bottom-4 left-0 right-0 mx-auto w-fit z-40">
                      <Pagination>
                        <PaginationContent className="flex justify-center items-center gap-3">
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                              }
                              className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                                currentPage === 1
                                  ? "pointer-events-none text-primary opacity-40"
                                  : "hover:text-primary-foreground cursor-pointer"
                              }`}
                            />
                          </PaginationItem>

                          <span className="text-sm font-medium select-none text-muted-foreground">
                            {currentPage}
                          </span>

                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(p + 1, totalPages)
                                )
                              }
                              className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                                currentPage === totalPages
                                  ? "pointer-events-none text-primary opacity-40"
                                  : "hover:text-accent-foreground cursor-pointer"
                              }`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </Card>
                  </div>
                </div>
                {/* <Separator /> */}

                <motion.div
                  className="w-full min-h-[340px] md:min-h-[500px] lg:min-h-[340px] xl:h-full rounded-lg grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence mode="popLayout">
                    {currentProjects.length > 0 ? (
                      currentProjects.map((project) => (
                        <motion.div
                          key={project.id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          className="w-full h-full"
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <ProjectCard
                            projectToShow={project}
                            tasks={project.Tasks || []}
                            onClick={handleProjectClick}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-muted-foreground text-center col-span-full pt-12"
                      >
                        No projects found. Add new projects to get started.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
                {projects.length > 0 && (
                  <div className=" flex flex-col md:flex-row gap-2">
                    <UpcomingDeadlines projects={projects} />

                    <motion.div
                      variants={itemVariants}
                      className="w-full h-full"
                    >
                      <QuickNoteCard />
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="w-full h-full"
                    >
                      <AiFeatureCard />
                    </motion.div>
                  </div>
                )}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <Pagination className="-mt-1 md:hidden lg:hidden xl:hidden">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => {
                              setCurrentPage(i + 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </div>
            {/* --- RIGHT SECTION (Sidebar) --- */}
            {/* Changed: Replaced percentage width with fixed constraints (shrink-0 lg:w-[350px] xl:w-[400px]) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex min-h-[340px] flex-col gap-2 mt-2 
    lg:mt-0 lg:flex-col lg:w-[350px] xl:w-[400px] shrink-0"
            >
              <div className="flex flex-col sm:flex-col md:flex-row lg:flex-col">
                <Card
                  className="max-h-[392px] bg-background flex p-0 border-none flex-col 
         w-full md:w-1/2 lg:w-full"
                >
                  <CardHeader className="flex justify-between -ml-4">
                    <CardTitle className="text-md"></CardTitle>
                  </CardHeader>

                  {projects.length > 0 && (
                    <Suspense fallback={<Loader />}>
                      <LatestProjects LatestProjects={projects} />
                    </Suspense>
                  )}
                </Card>
                <div className="flex h-auto md:h-[200px] lg:h-auto flex-col gap-2 w-full md:w-1/2 lg:w-full  ">
                  <Suspense fallback={<Loader />}>
                    <LatestUpdatedTasks latestTasks={latestTasks} />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </>
  );
};

export default HomePage;
