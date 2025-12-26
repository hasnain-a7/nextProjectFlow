import { StatsCard } from "@/components/StatsCard";
import { FolderOpen, UserCheck2, Clock, CheckCircle } from "lucide-react";

interface StatsProps {
  stats: {
    totalProjects: number;
    assignedProjects: number;
    activeProjects: number;
    totalTasks: number;
  };
}

export function StatsSection({ stats }: StatsProps) {
  return (
    <section className="">
      <div className="grid px-0.5 auto-rows-min gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        <StatsCard
          title="Projects"
          value={stats.totalProjects}
          icon={FolderOpen}
          color="bg-gradient-to-br from-sky-600 to-sky-700"
        />
        <StatsCard
          title="Assigned Projects"
          value={stats.assignedProjects}
          icon={UserCheck2}
          color="bg-gradient-to-br from-violet-600 to-violet-700"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Clock}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckCircle}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
        />
      </div>
    </section>
  );
}
