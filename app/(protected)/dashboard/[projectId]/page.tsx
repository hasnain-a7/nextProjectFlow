"use client";
import React, { useState, useMemo } from "react";
import { useProjectContext, Task } from "@/app/context/projectContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/config/Firebase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { ChevronsRightLeft, Plus, Edit, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load modals
const TaskDetailModal = dynamic(
  () => import("@/components/modols/TrelloModol"),
  { ssr: false }
);
const TaskModol = dynamic(() => import("@/components/modols/TaskModol"), {
  ssr: false,
});

const groupTasksByStatus = (Tasks: Task[], statuses: string[]) => {
  const groups: { [key: string]: Task[] } = {}; // Better typing for return value too

  statuses.forEach((status) => {
    // Now .filter works because Tasks is an array
    groups[status] = Tasks.filter((task) => task.status === status);
  });

  return groups;
};

const DashboardPage: React.FC = () => {
  const { projects, loading, deleteTaskFromProject } = useProjectContext();
  const params = useParams();
  const router = useRouter();
  const projectId =
    typeof params?.projectId === "string" ? params.projectId : "";

  const statuses = useMemo(
    () => ["backlog", "pending", "active", "inactive", "completed"],
    []
  );

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);
  const [prevProject, setPrevProject] = useState<any>(null);
  const [statusTasks, setStatusTasks] = useState<{ [key: string]: any[] }>({});
  const [cardWidth, setCardWidth] = useState(false);

  if (currentProject && currentProject !== prevProject) {
    setPrevProject(currentProject);
    setStatusTasks(groupTasksByStatus(currentProject.Tasks || [], statuses));
  }

  const updateTaskStatusInFirebase = async (
    taskId: string,
    newStatus: string
  ) => {
    try {
      if (!projectId) return;
      const todoRef = doc(db, "Projects", projectId, "tasks", taskId);
      await updateDoc(todoRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDragEnd = (event: DropResult) => {
    const { source, destination } = event;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    // Create a deep copy for optimistic UI update
    const newStatusTasks = { ...statusTasks };
    // Copy the arrays inside the object to ensure immutability
    newStatusTasks[sourceId] = [...newStatusTasks[sourceId]];
    if (sourceId !== destId) {
      newStatusTasks[destId] = newStatusTasks[destId]
        ? [...newStatusTasks[destId]]
        : [];
    }

    const [movedTask] = newStatusTasks[sourceId].splice(source.index, 1);

    if (sourceId !== destId) {
      movedTask.status = destId;
      newStatusTasks[destId].splice(destination.index, 0, movedTask);
      // Fire and forget Firebase update
      updateTaskStatusInFirebase(movedTask.id, destId);
    } else {
      // Same column reordering
      newStatusTasks[sourceId].splice(destination.index, 0, movedTask);
    }

    setStatusTasks(newStatusTasks);
  };

  const handleDelChange = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskFromProject(projectId, taskId);
        // Local update handled by the "Sync State During Render" block above
        // once Context updates, OR we can manually filter here for instant feedback:
        setStatusTasks((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((key) => {
            next[key] = next[key].filter((t) => t.id !== taskId);
          });
          return next;
        });
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <div className="w-full flex justify-between items-center px-4 py-2 border-b border-accent/35 rounded-t-md">
            <h2 className="text-lg font-semibold text-foreground">
              Drag & Drop
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardWidth((prev) => !prev);
                }}
              >
                <ChevronsRightLeft size={18} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-accent hover:text-accent-foreground"
                onClick={() => router.push(`/projects/${projectId}`)}
              >
                View List
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-3 h-full w-full overflow-y-auto scrollbar-thin rounded-b-md">
          {statuses.map((statusKey) => (
            <Droppable droppableId={statusKey} type="TASK" key={statusKey}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-none rounded-xl border shadow-sm transition-all duration-300 p-2.5 hover:shadow-md hover:border-accent/50
                  ${
                    cardWidth
                      ? "min-w-[60px] max-w-[60px] h-[50px]"
                      : "min-w-[230px] max-w-[260px]"
                  } max-h-min overflow-y-auto`}
                >
                  {!cardWidth ? (
                    <div className="flex justify-between items-center mb-1">
                      <h2 className="font-semibold text-base capitalize text-foreground truncate">
                        {statusKey}
                      </h2>
                    </div>
                  ) : (
                    <h3 className="text-sm font-semibold mb-1 text-center text-muted-foreground whitespace-nowrap w-8">
                      {statusKey.charAt(0).toUpperCase() + statusKey.slice(-1)}
                    </h3>
                  )}

                  {!cardWidth && (
                    <div className="flex flex-col gap-2">
                      {(!statusTasks[statusKey] ||
                        statusTasks[statusKey].length === 0) && (
                        <p className="text-[12px] text-muted-foreground text-center">
                          No tasks.
                        </p>
                      )}

                      {(statusTasks[statusKey] || []).map((todo, index) => (
                        <Draggable
                          key={todo.id}
                          draggableId={todo.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative p-2 flex flex-col gap-2 bg-card text-accent-foreground rounded-lg border border-transparent hover:border-accent shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                              {todo.attachments?.length > 0 && (
                                <Image
                                  src={todo.attachments[0]}
                                  alt="todo-attachment"
                                  width={200}
                                  height={96}
                                  className="w-full h-24 object-cover rounded-md"
                                />
                              )}

                              <Dialog>
                                <DialogTrigger asChild>
                                  <span
                                    className={`text-sm font-medium cursor-pointer ${
                                      todo.status === "completed"
                                        ? "line-through text-muted-foreground"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {todo.title}
                                  </span>
                                </DialogTrigger>
                                <TaskDetailModal
                                  task={todo}
                                  projectId={projectId}
                                />
                              </Dialog>

                              {todo.todo && (
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                  {todo.todo}
                                </p>
                              )}

                              <div
                                className={`flex items-center gap-2 absolute right-2 top-2 ${
                                  todo.attachments?.length > 0 ? " top-29" : ""
                                }`}
                              >
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Edit
                                      size={14}
                                      className="text-muted-foreground hover:text-primary cursor-pointer"
                                    />
                                  </DialogTrigger>
                                  <TaskModol
                                    projectId={projectId}
                                    taskToEdit={todo}
                                  />
                                </Dialog>
                                <Trash2
                                  size={14}
                                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                                  onClick={() => handleDelChange(todo.id || "")}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      <div className="w-full flex justify-end mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sm text-muted-foreground hover:text-primary hover:bg-accent/30 flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <TaskModol projectId={projectId} />
                        </Dialog>
                      </div>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default DashboardPage;
