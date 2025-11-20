import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FolderOpen, FolderCheck } from "lucide-react";

export function FiltersCard({ projects, allTasks }: any) {
  const completedTasks = allTasks.filter(
    (t: any) => t.status?.toLowerCase() === "completed"
  ).length;

  const activeProjects = projects.filter(
    (p: any) => p.status?.toLowerCase() === "active"
  ).length;

  return (
    <Card className="p-4 border-border/40 shadow-sm space-y-4 text-sm">
      <p className="font-semibold text-base flex items-center gap-2">
        ⚙️ Overview
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Completed Tasks</span>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {completedTasks}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="h-4 w-4 text-blue-500" />
            <span>All Projects</span>
          </div>
          <Badge variant="outline" className="text-xs px-2 py-1">
            {projects.length}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderCheck className="h-4 w-4 text-primary" />
            <span>Active Projects</span>
          </div>
          <Badge variant="default" className="text-xs px-2 py-1">
            {activeProjects}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
