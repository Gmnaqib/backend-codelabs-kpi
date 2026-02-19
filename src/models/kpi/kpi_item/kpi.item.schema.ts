import { Schema, model } from "mongoose";
import IKPIItem, { KPICategory } from "./kpi.item.interface";

const kpiItemSchema = new Schema<IKPIItem>(
  {
    category: {
      type: String,
      enum: Object.values(KPICategory),
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    point: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const IKPIItem = model<IKPIItem>("KPIItem", kpiItemSchema);

export default IKPIItem;
