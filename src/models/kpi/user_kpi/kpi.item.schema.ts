import { Schema, model } from "mongoose";
import IUserKPI from "./kpi.item.interface";

const userKpiSchema = new Schema<IUserKPI>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    kpiItemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const UserKPI = model<IUserKPI>("UserKPI", userKpiSchema);

export default UserKPI;
