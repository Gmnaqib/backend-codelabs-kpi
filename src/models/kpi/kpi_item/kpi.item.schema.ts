import { Schema, model } from "mongoose";
import IKPIItem from "./kpi.item.interface";

const kpiItemSchema = new Schema<IKPIItem>(
  {
    name: {
      type: String,
      required: true,
    },
    point: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const KPIItem = model<IKPIItem>("KPIItem", kpiItemSchema);

export default KPIItem;
