import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash2, Trello } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectModol from "./modols/ProjectModol";
import { useProjectContext, Project } from "@/app/context/projectContext";
import { useUserContextId } from "@/app/context/AuthContext";
interface ProjectOptionsProps {
  currentProjectDetails: Project;
}

const ProjectOptions = ({ currentProjectDetails }: ProjectOptionsProps) => {
  const navigate = useRouter();
  const { deleteProject } = useProjectContext();
  const { userContextId } = useUserContextId();

  const handleTrelloLink = (projectId: string) => {
    navigate.push(`/dashboard/${projectId}`);
  };

  const handleDelete = (projectId: string) => {
    console.log(`Deleting project with ID: ${projectId}`);
    deleteProject(projectId);
    navigate.push(`/Home`);
  };
  const isUser = currentProjectDetails?.userId === userContextId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
          <EllipsisVertical size={28} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 shadow-lg rounded-xl p-1 bg-background"
      >
        <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
          Project Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FaEdit className="h-4 w-4 text-chart-1" />
              Edit Project
            </DropdownMenuItem>
          </DialogTrigger>

          <ProjectModol ProjectToEdit={currentProjectDetails} />
        </Dialog>
        <DropdownMenuItem
          onClick={() => handleTrelloLink(currentProjectDetails?.id || "")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Trello className="h-4 w-4 text-chart-2" />
          View as Trello
        </DropdownMenuItem>

        {isUser && (
          <DropdownMenuItem
            onClick={() => handleDelete(currentProjectDetails?.id || "")}
            className="flex items-center gap-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4  text-destructive" />
            Delete Project
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectOptions;
