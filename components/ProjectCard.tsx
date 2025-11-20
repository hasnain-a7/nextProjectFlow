"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";

import { Progress } from "./ui/progress";
import { Calendar, Edit, Paperclip, UsersIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectModol from "./modols/ProjectModol";
import Image from "next/image";

interface Task {
  id?: string;
  title: string;
  status: string;
}

interface Project {
  id?: string;
  title: string;
  description: string;
  url?: string;
  createdAt: string;
  Category: string;
  dueDate?: string;
  label?: string;
  priority?: string;
  attachments?: string[];
  assignedUsers?: string[];
  comments?: number;
  members?: { avatar: string; name: string }[];
  projectEmoji?: string;
}

interface ProjectCardProps {
  projectToShow: Project;
  tasks: Task[];
  onClick?: (projectId: string) => void;
}

export const ProjectCard = ({
  projectToShow,
  tasks,
  onClick,
}: ProjectCardProps) => {
  const calculateProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const getTaskStats = (tasks?: Task[]) => {
    if (!tasks || !Array.isArray(tasks)) {
      return { completed: 0, inProgress: 0, pending: 0, total: 0 };
    }

    const stats = tasks.reduce(
      (acc, task) => {
        switch (task.status) {
          case "completed":
            acc.completed++;
            break;
          case "in-progress":
            acc.inProgress++;
            break;
          case "pending":
            acc.pending++;
            break;
        }
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0 }
    );

    return { ...stats, total: tasks.length };
  };

  const { completed, total } = getTaskStats(tasks);
  const percentage = calculateProgress(completed, total);

  const handleCardClick = () => {
    if (projectToShow.id) {
      onClick?.(projectToShow.id);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="w-full relative border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden pb-1"
    >
      <div className="w-full h-30 md:h-12 -mt-3">
        {projectToShow?.attachments?.[0] ? (
          <Image
            src={projectToShow.attachments[0]}
            alt={
              projectToShow.title ||
              "https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        ) : (
          <Image
            src="/hero.png" // fallback local image
            alt="Placeholder"
            width={500}
            height={300}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Header */}
      <CardHeader className="-mt-1 relative">
        {projectToShow?.projectEmoji && (
          <span className="text-lg absolute top-30 md:top-0 left-0">
            {projectToShow.projectEmoji}
          </span>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Edit
              size={16}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-32 md:top-2 right-2 text-muted-foreground hover:text-primary cursor-pointer"
            />
          </DialogTrigger>
          <ProjectModol ProjectToEdit={projectToShow} />
        </Dialog>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col gap-1 -mt-2 -ml-3 px-4">
        <CardTitle
          className={`text-base font-semibold ${
            projectToShow?.projectEmoji ? "ml-6" : ""
          }`}
        >
          {projectToShow?.title.charAt(0).toUpperCase() +
            projectToShow?.title.slice(1)}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {projectToShow.description || "No description provided."}
        </p>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-xs text-gray-500 flex gap-0.5">
            <Calendar size={14} />
            {projectToShow?.createdAt
              ? new Date(projectToShow.createdAt).toLocaleDateString()
              : "No date"}
          </span>

          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Paperclip className="w-3 h-3" />
              {projectToShow?.attachments?.length || 0}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <UsersIcon className="w-3 h-3" />
              {projectToShow?.assignedUsers?.length || 0}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between -ml-3 px-4">
        <div className="flex items-center gap-2 flex-1">
          <Progress value={percentage} className="h-2 flex-1 rounded-full" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {completed}/{total}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
