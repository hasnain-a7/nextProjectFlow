import React from "react";
import { Project } from "@/types/types";
import { fetchUserProjects } from "@/actions/serverAtctions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import ProjectModol from "./modols/ProjectModol";
import Link from "next/link";
import { getAuthUserId } from "@/lib/auth";
import { Edit } from "lucide-react";

const LatestProject = async () => {
  const userId = await getAuthUserId();

  let projects: Project[] = [];

  if (userId) {
    projects = await fetchUserProjects(userId);
  }

  const top5UpdatedProjects = [...projects]
    .filter((p) => p.updatedAt)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || "").getTime() -
        new Date(a.updatedAt || "").getTime()
    )
    .slice(0, 5);

  return (
    <Card className="w-full pb-1 pt-1 min-h-min border border-border/50 rounded-lg mt-1 bg-card">
      <CardHeader className="flex justify-between -ml-3">
        <CardTitle className="text-md">Recently Updated Projects</CardTitle>
        <Badge variant="outline" className="text-sm -mr-3">
          {top5UpdatedProjects.length}
        </Badge>
      </CardHeader>

      {top5UpdatedProjects.length > 0 ? (
        <ScrollArea className="w-full pr-1">
          <CardContent className="max-h-[198px] p-0 -mt-1">
            <div className="flex flex-col gap-2 p-1">
              {top5UpdatedProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="border rounded-md p-2 relative hover:-translate-y-1 hover:shadow-md transition cursor-pointer block"
                >
                  <div className="relative flex justify-between items-start">
                    <div>
                      <p className="font-medium">{project.title}</p>

                      <p className="text-xs text-gray-500">
                        UpdatedAt:{" "}
                        {new Date(project.updatedAt || "").toLocaleDateString()}
                      </p>

                      <p className="absolute bottom-0.5 right-1 text-xs text-gray-500">
                        Status:{" "}
                        {project.status &&
                          project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Edit
                          size={16}
                          className="text-muted-foreground hover:text-primary"
                        />
                      </DialogTrigger>
                      <ProjectModol ProjectToEdit={project} />
                    </Dialog>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      ) : (
        <p className="text-center text-sm text-muted-foreground pb-3">
          No recent project updates found.
        </p>
      )}
    </Card>
  );
};

export default LatestProject;
