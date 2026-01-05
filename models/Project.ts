import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String },
    projectEmoji: { type: String },
    status: { type: String, default: "active" },
    dueDate: { type: Date },
    attachments: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
