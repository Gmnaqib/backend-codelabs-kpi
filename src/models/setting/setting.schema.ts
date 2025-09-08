import { Schema, model } from "mongoose";
import ISetting from "./setting.interface";

const settingSchema = new Schema<ISetting>({
  code: {
    type: String,
    required: true,
    unique: true,
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

const Setting = model<ISetting>("Setting", settingSchema);

export default Setting;
