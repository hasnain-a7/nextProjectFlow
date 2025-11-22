"use client";
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectContext } from "@/app/context/projectContext";
import { ProjectCard } from "@/components/ProjectCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Clock,
  Folder,
  CalendarDays,
  ListTodo,
} from "lucide-react";
import { useRouter } from "next/navigation";
export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"projects" | "tasks">("projects");
  const { projects } = useProjectContext();
  const navigate = useRouter();
  const handleProjectClick = (id: string) => navigate.push(`/projects/${id}`);
  const allTasks = useMemo(() => {
    return projects.flatMap((p) =>
      (p.Tasks || []).map((t) => ({
        ...t,
        projectId: p.id,
        projectTitle: p.title,
        projectEmoji: p.projectEmoji,
      }))
    );
  }, [projects]);
  // --- 2. DATE MAPPING (For Calendar Highlights) ---
  const attributes = useMemo(() => {
    if (viewMode === "projects") {
      return {
        dates: projects
          .filter((p) => p.dueDate) // Changed from p.deadline
          .map((p) => new Date(p.dueDate!)), // Changed from p.deadline
        color: "bg-blue-500",
      };
    } else {
      return {
        dates: allTasks
          .filter((t) => t.dueDate)
          .map((t) => new Date(t.dueDate!)),
        color: "bg-emerald-500",
      };
    }
  }, [projects, allTasks, viewMode]);

  // --- 3. FILTERED DATA FOR SELECTED DATE ---
  const selectedData = useMemo(() => {
    if (!date) return { tasks: [], projects: [] };

    if (viewMode === "projects") {
      return {
        // Changed from p.deadline to p.dueDate
        projects: projects.filter((p) =>
          p.dueDate ? isSameDay(new Date(p.dueDate), date) : false
        ),
        tasks: [],
      };
    } else {
      return {
        projects: [],
        tasks: allTasks.filter((t) =>
          t.dueDate ? isSameDay(new Date(t.dueDate), date) : false
        ),
      };
    }
  }, [date, projects, allTasks, viewMode]);
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-6 p-4 md:p-4 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground text-sm">
            Manage your project timelines and daily tasks.
          </p>
        </div>

        {/* VIEW SWITCHER */}
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "projects" | "tasks")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full md:w-[300px] grid-cols-2">
            <TabsTrigger value="projects" className="gap-2">
              <Folder size={16} /> Projects
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo size={16} /> Tasks
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* --- LEFT COLUMN: CALENDAR --- */}
        <Card className="h-fit shrink-0 border-border/50 shadow-sm">
          <CardContent className="p-4 flex-col gap-4 ">
            <div className="mb-2 mx-auto flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    viewMode === "projects" ? "bg-blue-500" : "bg-emerald-500"
                  }`}
                />
                <span>
                  {viewMode === "projects"
                    ? "Project Deadlines"
                    : "Task Due Dates"}
                </span>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                highlighted: attributes.dates,
              }}
              modifiersClassNames={{
                highlighted: `${attributes.color} text-white font-bold rounded-md hover:opacity-90`,
              }}
            />
          </CardContent>
        </Card>

        {/* --- RIGHT COLUMN: CONTENT --- */}
        <Card className="flex-1 border-border/50 shadow-sm overflow-hidden flex flex-col bg-background/50 backdrop-blur-sm">
          <CardHeader className="border-b -mt-3 py-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {date
                      ? format(date, "EEEE, MMMM do, yyyy")
                      : "Select a date"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    {viewMode === "projects"
                      ? "Projects Due"
                      : "Tasks Scheduled"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {viewMode === "projects"
                  ? `${selectedData.projects.length} Projects`
                  : `${selectedData.tasks.length} Tasks`}
              </Badge>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-2 md:p-4">
            {viewMode === "projects" && (
              <div className="space-y-4">
                {selectedData.projects.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {selectedData.projects.map((project) => (
                      // Reusing your existing Project Component
                      <div
                        key={project.id}
                        className="transform transition-all hover:scale-[1.01]"
                      >
                        <ProjectCard
                          projectToShow={project}
                          tasks={project.Tasks || []}
                          onClick={handleProjectClick}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No projects due on this date." />
                )}
              </div>
            )}

            {/* VIEW 2: TASKS ACCORDION TABLE */}
            {viewMode === "tasks" && (
              <div className="w-full">
                {selectedData.tasks.length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                  >
                    {selectedData.tasks.map((task) => (
                      <AccordionItem
                        key={task?.id}
                        value={task?.id}
                        className="border rounded-lg px-4 bg-card hover:bg-accent/5 transition-colors"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-4 w-full pr-2">
                            {task.status === "done" ? (
                              <CheckCircle2 className="text-green-500 h-5 w-5 shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                            )}

                            {/* Task Title & Project */}
                            <div className="flex flex-col items-start text-left flex-1">
                              <span
                                className={`font-medium text-sm ${
                                  task.status === "done"
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {task.title}
                              </span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                {task.projectEmoji} {task.projectTitle}
                              </span>
                            </div>

                            {/* Time Pill */}
                            {task.dueDate && (
                              <Badge
                                variant="secondary"
                                className="hidden sm:flex gap-1 font-normal text-xs"
                              >
                                <Clock size={12} />
                                {format(new Date(task.dueDate), "h:mm a")}
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1 px-9">
                          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                            <p className="bg-muted/30 p-3 rounded-md border border-border/50">
                              {task.todo ||
                                "No description provided for this task."}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="capitalize">
                                Priority:{" "}
                                <span className="text-foreground font-medium">
                                  {task?.priority || "Normal"}
                                </span>
                              </span>
                              <span className="capitalize">
                                Status:{" "}
                                <span className="text-foreground font-medium">
                                  {task.status || "To Do"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <EmptyState message="No tasks scheduled for this date." />
                )}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

// Helper Component for Empty States to keep code Lite
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center text-muted-foreground opacity-60">
      <CalendarDays size={48} className="mb-4 opacity-20" />
      <p>{message}</p>
    </div>
  );
}
