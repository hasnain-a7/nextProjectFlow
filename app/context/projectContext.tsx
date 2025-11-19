"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "@/app/config/Firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export interface Task {
  id?: string;
  title: string;
  todo: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  attachments?: string[];
  dueDate?: string;
  userId?: string | null;
  projectId?: string;
  todoEmoji?: string;
}

export interface User {
  id?: string;
  email: string;
  fullname: string;
  location?: string | null;
  occupation?: string | null;
  organization?: string | null;
  isActive?: boolean;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id?: string;
  title: string;
  Category: string;
  description: string;
  url?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
  attachments?: string[];
  dueDate?: string;
  status?: string;
  assignedUsers?: string[];
  projectEmoji?: string;
  Tasks?: Task[];
}

interface ProjectContextType {
  projects: Project[];
  userData: User;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  loading: boolean;

  // Tasks
  addTaskToProject: (
    projectId: string,
    formData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[];
      dueDate?: string;
      todoEmoji?: string;
    }
  ) => Promise<string>;
  updateTaskInProject: (
    projectid: string,
    taskId: string,
    updatedData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[] | undefined;
      dueDate?: string;
    }
  ) => Promise<void>;
  deleteTaskFromProject: (projectId: string, taskId: string) => Promise<void>;
  setLoading: (l: boolean) => void;

  // Projects
  fetchUserProjects: (userId: string) => Promise<void>;
  fetchUserData: (userId: string) => Promise<User | undefined>;
  updateUserData: (data: User) => Promise<User | undefined>;
  deleteUserData: (userId: string) => Promise<void>;
  addProject: (
    title: string,
    userId: string,
    discription: string,
    Category: string,
    attachments: string[],
    dueDate?: string,
    status?: string,
    projectEmoji?: string
  ) => Promise<string>;
  updateProject: (
    projectId: string,
    title: string,
    description?: string,
    Category?: string,
    attachments?: string[],
    dueDate?: string,
    status?: string,
    assignedUsers?: string[],
    deletedUsers?: string[],
    projectEmoji?: string
  ) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userData, setuserData] = useState<User>({} as User);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDocs(
        query(collection(db, "users"), where("id", "==", userId))
      ); // Or getDoc if ID matches document ID

      const userDocSnap = await getDoc(userRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        setuserData(userData);
        return userData;
      } else {
        console.warn("⚠️ No user data found for:", userId);
        setuserData({} as User);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const fetchUserProjects = async (userId: string) => {
    try {
      setLoading(true);

      const ownedQuery = query(
        collection(db, "Projects"),
        where("userId", "==", userId)
      );
      const ownedSnapshot = await getDocs(ownedQuery);

      const assignedQuery = query(
        collection(db, "Projects"),
        where("assignedUsers", "array-contains", userId)
      );
      const assignedSnapshot = await getDocs(assignedQuery);

      const combinedDocs = [
        ...ownedSnapshot.docs,
        ...assignedSnapshot.docs,
      ].filter(
        (doc, index, self) => index === self.findIndex((d) => d.id === doc.id)
      );
      console.log(
        `🔄 Fetched ${combinedDocs.length} projects for user ${userId}`
      );

      if (combinedDocs.length === 0) {
        console.log("⚠️ No projects found for this user.");
        setProjects([]);
        return;
      }

      // 🔹 Map project data AND fetch tasks for each project
      const projectsData = await Promise.all(
        combinedDocs.map(async (docSnapshot) => {
          const projectData = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as Project;

          // Fetch tasks for this specific project
          const taskSnap = await getDocs(
            collection(db, "Projects", projectData.id!, "tasks")
          );

          const tasks = taskSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Task[];

          // Return project with nested tasks
          return { ...projectData, Tasks: tasks };
        })
      );

      setProjects(projectsData);
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (data: User): Promise<User | undefined> => {
    setLoading(true);
    try {
      if (!data.id) throw new Error("❌ No user ID provided.");

      const userRef = doc(db, "users", data.id);

      const userUpdateData = {
        fullname: data.fullname,
        location: data.location,
        email: data.email,
        occupation: data.occupation,
        organization: data.organization, // Fixed typo from 'origanization'
        isActive: data.isActive,
        bio: data.bio,
        avatar: data.avatar,
        coverImage: data.coverImage,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, userUpdateData);
      setuserData((prev) => ({ ...prev, ...userUpdateData }));

      console.log("✅ User data updated successfully!");
      return userUpdateData;
    } catch (error) {
      console.error("❌ Error updating user:", error);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const deleteUserData = async (userId: string) => {
    try {
      setLoading(true);
      const confirmed = window.confirm(
        `Are you sure you want to delete user data?`
      );
      if (!confirmed) return;

      await deleteDoc(doc(db, "users", userId));
      // Note: This logic seemed slightly off in original (filtering projects based on user delete).
      // Assuming you want to clear user data locally:
      setuserData({} as User);
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (
    title: string,
    userId: string,
    description?: string,
    Category?: string,
    attachments?: string[],
    dueDate?: string,
    status?: string,
    projectEmoji?: string
  ) => {
    try {
      setLoading(true);

      if (!title.trim() || !userId) return "";

      const projectData = {
        title,
        description: description || "",
        Category: Category || "",
        attachments,
        userId,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || "",
        status: status,
        projectEmoji: projectEmoji,
      };

      const docRef = await addDoc(collection(db, "Projects"), projectData);

      // Initialize with empty tasks array locally
      setProjects((prev) => [
        ...prev,
        { id: docRef.id, ...projectData, Tasks: [] },
      ]);

      return docRef.id;
    } catch (err) {
      console.error("❌ Error creating project:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (
    projectId: string,
    title: string,
    description?: string,
    Category?: string,
    attachments?: string[],
    dueDate?: string,
    status?: string,
    assignedUsers?: string[],
    deletedUsers?: string[],
    projectEmoji?: string
  ) => {
    try {
      setLoading(true);

      if (!projectId || !title.trim()) return false;
      const projectRef = doc(db, "Projects", projectId);
      const updatedData = {
        title,
        description: description || "",
        attachments: attachments || [],
        Category: Category || "",
        updatedAt: new Date().toISOString(),
        dueDate: dueDate || "",
        status: status || "",
        projectEmoji: projectEmoji,
      };
      await updateDoc(projectRef, updatedData);
      if (assignedUsers && assignedUsers.length > 0) {
        await updateDoc(projectRef, {
          assignedUsers: arrayUnion(...assignedUsers),
        });
      }
      if (deletedUsers && deletedUsers.length > 0) {
        await updateDoc(projectRef, {
          assignedUsers: arrayRemove(...deletedUsers),
        });
      }
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                ...updatedData,
                assignedUsers: (() => {
                  let updated = p.assignedUsers || [];
                  if (deletedUsers?.length)
                    updated = updated.filter(
                      (id) => !deletedUsers.includes(id)
                    );
                  if (assignedUsers?.length)
                    updated = Array.from(
                      new Set([...updated, ...assignedUsers])
                    );

                  return updated;
                })(),
              }
            : p
        )
      );

      return true;
    } catch (err) {
      console.error("❌ Error updating project:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      const confirmed = window.confirm(
        `Are you sure you want to delete this project?`
      );
      if (!confirmed) return;

      await deleteDoc(doc(db, "Projects", projectId));
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("❌ Error deleting project:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTaskToProject = async (
    projectId: string,
    formData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[];
      dueDate?: string;
      todoEmoji?: string;
    }
  ): Promise<string> => {
    try {
      const newTask: Task = {
        title: formData.title?.trim() || "Untitled Task",
        todo: formData.todo?.trim() || "",
        status: formData.status || "backlog",
        attachments: formData.attachments ?? [],
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate ?? "",
        todoEmoji: formData.todoEmoji,
      };

      const taskRef = await addDoc(
        collection(db, "Projects", projectId, "tasks"),
        newTask
      );

      // Update Projects State directly
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              Tasks: [...(project.Tasks || []), { ...newTask, id: taskRef.id }],
            };
          }
          return project;
        })
      );

      return taskRef.id;
    } catch (err) {
      console.error("❌ Error adding task:", err);
      throw err;
    }
  };

  const deleteTaskFromProject = async (
    projectId: string,
    taskId: string
  ): Promise<void> => {
    try {
      setLoading(true);

      const taskRef = doc(db, "Projects", projectId, "tasks", taskId);

      await deleteDoc(taskRef);

      // Update Projects State directly
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              Tasks: project.Tasks
                ? project.Tasks.filter((task) => task.id !== taskId)
                : [],
            };
          }
          return project;
        })
      );
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskInProject = async (
    projectid: string,
    taskId: string,
    updatedData: {
      title?: string;
      todo?: string;
      status?: string;
      attachments?: string[];
      dueDate?: string;
      todoEmoji?: string;
    }
  ): Promise<void> => {
    try {
      setLoading(true);

      if (!projectid || !taskId) {
        console.error("❌ Missing projectId or taskId", { projectid, taskId });
        return;
      }
      const taskRef = doc(db, "Projects", projectid, "tasks", taskId);

      const newUpdateData = {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(taskRef, newUpdateData);

      // Update Projects State directly
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectid) {
            return {
              ...project,
              Tasks: project.Tasks?.map((task) =>
                task.id === taskId ? { ...task, ...newUpdateData } : task
              ),
            };
          }
          return project;
        })
      );
    } catch (err) {
      console.error("❌ Error updating task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProjects(user.uid);
        fetchUserData(user.uid);
      } else if (!user) {
        setProjects([]);
        setuserData({} as User);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        userData,
        updateUserData,
        fetchUserData,
        deleteUserData,
        projects,
        setProjects,
        loading,
        setLoading,
        addTaskToProject,
        updateTaskInProject,
        fetchUserProjects,
        addProject,
        updateProject,
        deleteProject,
        deleteTaskFromProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useTaskContext must be used within TaskProvider");
  return context;
};
