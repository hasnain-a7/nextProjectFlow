import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    todo: { type: String, required: true },
    todoEmoji: { type: String },
    status: { type: String, default: "backlog" },
    attachments: [{ type: String }],
    dueDate: { type: Date },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Task = models.Task || model("Task", TaskSchema);
export default Task;
