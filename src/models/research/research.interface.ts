import { Types } from "mongoose";

interface IResearch {
  userId: Types.ObjectId;
  week: number;
  category: CategoryType;
  research_type: string;
  title: string;
  link: string;
  progress: progressStatus;
  challenge?: string;
  status?: statusResearch;
}

export enum CategoryType {
  Personal = "personal",
  Product = "product",
}

export enum progressStatus {
  Finished = "finished",
  Unfinished = "unfinished",
}

export enum statusResearch {
  approved = "approved",
  pending = "pending",
  rejected = "rejected",
}

export default IResearch;
