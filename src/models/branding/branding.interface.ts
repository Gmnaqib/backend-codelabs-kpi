import { Types } from "mongoose";

interface IBranding {
  userId: Types.ObjectId;
  name: string;
  description: string;
  research: researchCategory;
  level: string;
  link: string;
  status: brandingStatus;
  createdAt?: Date;
}

export enum brandingStatus {
  Approved = "approved",
  Rejected = "rejected",
  Pending = "pending",
}

export enum researchCategory {
  website = "website",
  mobile = "mobile",
  game = "game",
  ui = "ui/ux",
  data = "data",
  other = "other",
}

export enum brandingLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export default IBranding;
