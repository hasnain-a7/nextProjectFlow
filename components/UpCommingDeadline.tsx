"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Project = {
  id?: string;
  title: string;
  dueDate?: string;
};

export function UpcomingDeadlines({ projects = [] }: { projects: Project[] }) {
  const sorted = [...projects]
    .filter((p) => p.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
    )
    .slice(0, 3);

  const navigate = useRouter();
  const handleProjectClick = (id: string) => navigate.push(`/projects/${id}`);
  const handleScheduleClick = () => navigate.push(`/schedule`);

  return (
    <Card className="w-full h-full flex flex-col bg-card hover:border-primary/50 transition-colors duration-300">
      <CardHeader className=" flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-md font-medium text-muted-foreground">
          <CalendarDays size={16} />
          Deadlines
        </CardTitle>

        {/* Changed Badge to a small ghost button for better UX, or kept Badge with pointer */}
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors "
          onClick={handleScheduleClick}
        >
          View
          <ArrowUpRight
            size={12}
            className="ml-1 opacity-50 group-hover:opacity-100"
          />
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-1 p-x3 py-1">
            {sorted.length > 0 ? (
              sorted.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleProjectClick(p?.id || "")}
                  className="group flex items-center justify-between text-sm px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-muted/80 hover:scale-[1.02]"
                >
                  <div className="flex flex-col gap-0.5 max-w-[70%]">
                    <span className="font-medium truncate group-hover:text-primary transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Project ID: {p.id?.slice(0, 4)}...
                    </span>
                  </div>

                  <div className="flex items-center bg-background border px-2 py-1 rounded text-xs font-medium text-foreground whitespace-nowrap shadow-sm">
                    {new Date(p.dueDate ?? 0).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground gap-2">
                <CalendarDays size={24} className="opacity-20" />
                <p className="text-xs">No upcoming deadlines</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
