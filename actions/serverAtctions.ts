"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import mongoose, { UpdateQuery } from "mongoose";

// ----------------- User -----------------
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

export async function updateUserData(data: any) {
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

// ----------------- Projects -----------------
export async function fetchUserProjects(userId: string) {
  try {
    await connectDB();
    const objectId = new mongoose.Types.ObjectId(userId);

    const ownedProjects = await Project.find({ userId: objectId }).lean();
    const assignedProjects = await Project.find({
      assignedUsers: objectId,
    }).lean();

    const combinedProjects = [
      ...ownedProjects,
      ...assignedProjects.filter(
        (p) =>
          !ownedProjects.some((op) => op._id.toString() === p._id.toString())
      ),
    ];

    // Convert Mongoose objects to plain JS objects with string IDs
    const plainProjects = combinedProjects.map((p) => ({
      ...p,
      _id: p._id.toString(),
      userId: p.userId?.toString(),
      assignedUsers: p.assignedUsers?.map((id) => id.toString()) || [],
      tasks:
        p.tasks?.map((t: any) => ({
          ...t,
          _id: t._id.toString(),
          createdAt: t.createdAt?.toISOString(),
          updatedAt: t.updatedAt?.toISOString(),
        })) || [],
      dueDate: p.dueDate?.toISOString() || null,
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    }));

    return plainProjects;
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    return [];
  }
}

export async function addProject(data: any) {
  try {
    await connectDB();

    if (data.userId) data.userId = new mongoose.Types.ObjectId(data.userId);
    if (data.assignedUsers?.length)
      data.assignedUsers = data.assignedUsers.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );

    const project = await Project.create({ ...data, createdAt: new Date() });
    return project._id.toString();
  } catch (err) {
    console.error("❌ Error adding project:", err);
    return "";
  }
}

export async function updateProject(
  projectId: string,
  data: any,
  assignedUsers?: string[],
  deletedUsers?: string[]
) {
  try {
    await connectDB();

    const update: UpdateQuery<any> = { ...data, updatedAt: new Date() };

    if (assignedUsers?.length)
      update.$addToSet = {
        assignedUsers: {
          $each: assignedUsers.map((id) => new mongoose.Types.ObjectId(id)),
        },
      };
    if (deletedUsers?.length)
      update.$pull = {
        assignedUsers: {
          $in: deletedUsers.map((id) => new mongoose.Types.ObjectId(id)),
        },
      };

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

// ----------------- Tasks -----------------
export async function addTaskToProject(projectId: string, task: any) {
  try {
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    project.tasks.push({ ...task, createdAt: new Date() });
    await project.save();

    return project.tasks[project.tasks.length - 1]._id.toString();
  } catch (err) {
    console.error("❌ Error adding task:", err);
    return "";
  }
}

export async function updateTaskInProject(
  projectId: string,
  taskId: string,
  updatedData: any
) {
  try {
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    const task = project.tasks.id(taskId);
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

    project.tasks.id(taskId)?.remove();
    await project.save();

    return true;
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    return false;
  }
}
