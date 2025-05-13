import { Schema, model } from "mongoose";
import ISetting from "./settingInterface";

const settingSchema = new Schema<ISetting>({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Setting = model<ISetting>("Attendance", settingSchema);

export default Setting;
