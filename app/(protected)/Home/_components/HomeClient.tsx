import { Suspense } from "react";

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
import { IProject } from "@/types/types";
import HomeHeader from "./HomeHeader";

interface DashboardClientProps {
  initialProjects: IProject;
  latestProject: IProject;
  lastUpdatedProject: IProject;
}

export default function HomeClient({ initialProjects }: DashboardClientProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-2 mt-1">
      {/* LEFT SECTION */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-2">
          <HomeHeader />

          <Suspense fallback={<ProjectsGridSkeleton count={8} />}>
            <StreamingProjectsGrid />
          </Suspense>

          {initialProjects && (
            <div className="flex flex-col md:flex-row gap-2">
              <UpcomingDeadlines projects={initialProjects} />
              <div className="w-full h-full">
                <QuickNoteCard />
              </div>
              <div className="w-full h-full">
                <AiFeatureCard />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex min-h-[340px] flex-col gap-2 mt-2 lg:mt-0 lg:flex-col lg:w-[350px] xl:w-[400px] shrink-0">
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
      </div>
    </div>
  );
}
