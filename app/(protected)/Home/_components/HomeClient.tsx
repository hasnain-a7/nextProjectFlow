// components/DashboardClient.tsx
"use client";

import { useMemo, useState, useDeferredValue, lazy, Suspense } from "react";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { motion, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { UpcomingDeadlines } from "@/components/UpCommingDeadline";
import LatestProjects from "@/components/LatestProjects";
import LatestUpdatedTasks from "@/components/LatestUpdatedTasks";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AiFeatureCard } from "@/components/AiFeaturedCard";
import { QuickNoteCard } from "@/components/QuickNoteCard";

import {
  ProjectsGridSkeleton,
  StreamingProjectsGrid,
} from "@/components/ProjectsGrid";
import { LatestProjectSkeleton } from "@/components/Skeletons";
import { Project } from "@/actions/serverAtctions";

const ProjectModol = lazy(() => import("@/components/modols/ProjectModol"));

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

interface DashboardClientProps {
  initialProjects: Project;
  latestProject: Project;
  lastUpdatedProject: Project;
}

export default function HomeClient({
  initialProjects,
  latestProject,
  lastUpdatedProject,
}: DashboardClientProps) {
  const navigate = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [filter, setFilter] = useState<"all" | "recent" | "lastupdated">("all");
  const [filteredCategory, setFilteredCategory] = useState("");

  const filteredProjects = useMemo(() => {
    const q = (deferredSearch || "").trim().toLowerCase();

    return (initialProjects || [])?.filter((project) => {
      const title = (project.title || "").toLowerCase();
      const description = (project.description || "").toLowerCase();
      const category = (project.Category || "").toLowerCase();

      const titleMatch =
        q === "" ? true : title.includes(q) || description.includes(q);

      const categoryMatch = filteredCategory
        ? category === filteredCategory.toLowerCase()
        : true;

      const dropdownMatch =
        filter === "recent"
          ? project.id === latestProject?._id
          : filter === "lastupdated"
          ? project.id === lastUpdatedProject?._id
          : true;

      return titleMatch && categoryMatch && dropdownMatch;
    });
  }, [
    initialProjects,
    deferredSearch,
    filteredCategory,
    filter,
    latestProject,
    lastUpdatedProject,
  ]);

  const Categories = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};

    initialProjects.forEach((p) => {
      if (!p.Category) return;

      const clean = p.Category.trim().toLowerCase();

      if (!counts[clean]) {
        counts[clean] = {
          name:
            p.Category.trim().charAt(0).toUpperCase() +
            p.Category.trim().slice(1).toLowerCase(),
          count: 0,
        };
      }

      counts[clean].count += 1;
    });

    return Object.values(counts);
  }, [initialProjects]);

  const handleCategoryProject = (value: string) => {
    setFilteredCategory(value === "all" ? "" : value);
  };

  const handleFilterChange = (value: string) => {
    if (value === "all" || value === "recent" || value === "lastupdated") {
      setFilter(value);
    }
  };

  const handleProjectClick = (id: string) => navigate.push(`/projects/${id}`);

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row h-full w-full gap-2 mt-2"
    >
      {/* LEFT SECTION */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-2">
          {/* Header / Filter Section */}
          <div className="flex flex-col md:flex-row lg:flex-row lg:items-center lg:justify-between w-full gap-2 pt-2 shadow-sm">
            <div className="relative flex items-center w-full sm:max-w-sm md:max-w-md">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-14 py-2 rounded-lg border text-sm"
              />
              <kbd className="absolute right-3 text-[12px] px-1.5 py-0.5 rounded">
                ⌘ K
              </kbd>
            </div>

            <div className="flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
              <Select defaultValue="all" onValueChange={handleFilterChange}>
                <SelectTrigger className="min-w-[125px]">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="lastupdated">Last Updated</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all" onValueChange={handleCategoryProject}>
                <SelectTrigger className="min-w-[125px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Categories</SelectItem>
                  {Categories.map((c) => (
                    <SelectItem
                      key={c.name}
                      value={c.name}
                      className="flex items-center justify-between gap-3 px-2 py-1"
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground text-sm">
                        ({c.count})
                      </span>
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
                <ProjectModol />
              </Dialog>
            </div>
          </div>

          <Suspense fallback={<ProjectsGridSkeleton count={8} />}>
            <StreamingProjectsGrid handleProjectClick={handleProjectClick} />
          </Suspense>

          {initialProjects && (
            <div className="flex flex-col md:flex-row gap-2">
              <UpcomingDeadlines projects={initialProjects} />
              <motion.div variants={itemVariants} className="w-full h-full">
                <QuickNoteCard />
              </motion.div>
              <motion.div variants={itemVariants} className="w-full h-full">
                <AiFeatureCard />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex min-h-[340px] flex-col gap-2 mt-2 lg:mt-0 lg:flex-col lg:w-[350px] xl:w-[400px] shrink-0"
      >
        <div className="flex flex-col sm:flex-col md:flex-row lg:flex-col">
          <Card className="max-h-[392px] bg-background flex p-0 border-none flex-col w-full md:w-1/2 lg:w-full">
            <CardHeader className="flex justify-between -ml-4">
              <CardTitle className="text-md"></CardTitle>
            </CardHeader>
            {initialProjects && (
              <Suspense fallback={<LatestProjectSkeleton />}>
                <LatestProjects />
              </Suspense>
            )}
          </Card>
          <div className="flex h-auto md:h-[200px] lg:h-auto flex-col gap-2 w-full md:w-1/2 lg:w-full">
            <Suspense fallback={<LatestProjectSkeleton />}>
              <LatestUpdatedTasks />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
