"use client";
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectContext } from "@/app/context/projectContext";
import { cn } from "@/lib/utils";
import { FiltersCard } from "@/components/FilterCard";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState("daily");

  const { projects } = useProjectContext();

  const allTasks = useMemo(() => {
    return projects.flatMap((project) => {
      return (project.Tasks || []).map((task) => ({
        ...task,
        projectId: project.id,
        projectName: project.title || "Untitled Project",
        projectEmoji: project.projectEmoji || "📁",
      }));
    });
  }, [projects]);

  const datesWithTasks = Array.from(
    new Set(
      allTasks
        .filter((t) => t.dueDate)
        .map((t) => format(new Date(t.dueDate ?? ""), "yyyy-MM-dd"))
    )
  );

  const tasksForDay = allTasks.filter(
    (t) =>
      t.dueDate &&
      format(new Date(t.dueDate), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 w-full lg:w-[23%] ">
        <Card className="p-4  border-border/40 shadow-sm">
          <Calendar
            mode="single"
            required
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            modifiers={{
              hasTasks: (date) =>
                datesWithTasks.includes(format(date, "yyyy-MM-dd")),
            }}
            modifiersClassNames={{
              hasTasks:
                "bg-primary/20 text-primary font-semibold rounded-md border border-primary/30",
            }}
          />
        </Card>

        <FiltersCard projects={projects} allTasks={allTasks} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            {format(selectedDate, "MMMM dd, yyyy")}
          </h2>

          <div className="flex items-center gap-2">
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="shadow-sm">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" className="ml-1">
              + Create Event
            </Button>
          </div>
        </div>

        {/* Task list */}
        <ScrollArea className="h-[70vh] rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-4">
          {tasksForDay.length === 0 ? (
            <p className="text-center text-muted-foreground mt-10">
              No tasks for this day.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {tasksForDay.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "rounded-xl p-4 border shadow-sm bg-accent/10 hover:bg-accent/20 transition-all flex-1 min-w-[250px]"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-background text-lg">
                      {task.todoEmoji || task.projectEmoji || "🗒️"}
                    </div>

                    <div className="flex flex-col w-full">
                      <h3 className="text-sm font-semibold truncate">
                        {task.title || "Untitled Task"}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {task.todo || "No description provided."}
                      </p>

                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>{task.projectName}</span>
                        {task.dueDate && (
                          <span>
                            {format(new Date(task.dueDate), "hh:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
