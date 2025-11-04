import { Types } from "mongoose";
interface IKPI {
  userId: Types.ObjectId;
  month: number;
  year: number;
  attendance: number;
  research: number;
  competition: number;
  operational: number;
  branding: number;
}

export default IKPI;
