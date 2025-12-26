"use server";
import User from "@/models/User";
import Project from "@/models/Project";
import { connectDB } from "@/lib/db";
import { UpdateQuery } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export interface User {
  _id?: string;
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
export interface Task {
  _id?: string;
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
export interface Project {
  _id?: string;
  title: string;
  Category?: string;
  description: string;
  url?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  attachments?: string[];
  dueDate?: string;
  status?: string;
  assignedUsers?: string[];
  projectEmoji?: string;
  Tasks?: Task[];
}
export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function fetchUserData(userId: string) {
  try {
    await connectDB();
    const user = await User.findById(userId).lean();
    return user || null;
  } catch (err) {
    console.error("❌ Error fetching user data:", err);
    return null;
  }
}
export async function updateUserData(data: User) {
  try {
    await connectDB();
    if (!data._id) throw new Error("No user ID provided");

    const updatedUser = await User.findByIdAndUpdate(
      data._id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();

    return updatedUser || null;
  } catch (err) {
    console.error("❌ Error updating user:", err);
    return null;
  }
}
export async function deleteUserData(userId: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(userId);
    return true;
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    return false;
  }
}
export async function fetchUserProjects(userId: string) {
  try {
    await connectDB();

    const ownedProjects = await Project.find({ userId }).lean();
    const assignedProjects = await Project.find({
      assignedUsers: userId,
    }).lean();

    // Combine and remove duplicates
    const combinedProjects = [
      ...ownedProjects,
      ...assignedProjects.filter(
        (p) =>
          !ownedProjects.some((op) => op._id.toString() === p._id.toString())
      ),
    ];

    return combinedProjects;
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    return [];
  }
}
export async function addProject(data: Project) {
  try {
    await connectDB();
    const project = await Project.create({ ...data, createdAt: new Date() });
    return project._id.toString();
  } catch (err) {
    console.error("❌ Error adding project:", err);
    return "";
  }
}
export async function updateProject(
  projectId: string,
  data: Project,
  assignedUsers?: string[],
  deletedUsers?: string[]
) {
  try {
    await connectDB();

    const update: UpdateQuery<Project> = { ...data, updatedAt: new Date() };
    if (assignedUsers?.length)
      update.$addToSet = { assignedUsers: { $each: assignedUsers } };
    if (deletedUsers?.length)
      update.$pull = { assignedUsers: { $in: deletedUsers } };

    await Project.findByIdAndUpdate(projectId, update, { new: true });
    return true;
  } catch (err) {
    console.error("❌ Error updating project:", err);
    return false;
  }
}
export async function deleteProject(projectId: string) {
  try {
    await connectDB();
    await Project.findByIdAndDelete(projectId);
    return true;
  } catch (err) {
    console.error("❌ Error deleting project:", err);
    return false;
  }
}
export async function addTaskToProject(projectId: string, task: Task) {
  try {
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    project.Tasks.push({ ...task, createdAt: new Date() });
    await project.save();

    return project.Tasks[project.Tasks.length - 1]._id.toString();
  } catch (err) {
    console.error("❌ Error adding task:", err);
    return "";
  }
}
export async function updateTaskInProject(
  projectId: string,
  taskId: string,
  updatedData: Task
) {
  try {
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    const task = project.Tasks.id(taskId);
    if (!task) throw new Error("Task not found");

    Object.assign(task, updatedData, { updatedAt: new Date() });
    await project.save();

    return true;
  } catch (err) {
    console.error("❌ Error updating task:", err);
    return false;
  }
}
export async function deleteTaskFromProject(projectId: string, taskId: string) {
  try {
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    project.Tasks.id(taskId)?.remove();
    await project.save();

    return true;
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    return false;
  }
}
