import { Schema } from "mongoose";
import IUser from "./userInterface";
import mongoose from "mongoose";

const userSchema = new Schema<IUser>({
  nim: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  majors: {
    type: String,
    required: true,
  },
  years: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "graduated"],
    default: "active",
  },
  research: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default userSchema;
