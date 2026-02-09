import { Types } from "mongoose";

export interface IUserKPI {
  userId?: Types.ObjectId;
  kpiItemId: Types.ObjectId;
}

export default IUserKPI;
