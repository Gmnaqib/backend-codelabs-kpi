import { Types } from "mongoose";

export interface IKPIScoring {
  activity: string;
  detail: string;
  score: number;
}

export interface IKPI {
  userId: Types.ObjectId;
  month: number;
  year: number;
  scoring?: IKPIScoring[];
}

export interface KPISummary {
  name: string;
  totalAttendance: number;
  totalTematik: number;
  totalPicket: number;
  totalPoint: number;
  year: number;
  month: number;
}

export interface ResearchSummary {
  name: string;
  totalUnfinished: number;
  totalFinished: number;
  totalApproved: number;
  totalPoint: number;
  year: number;
  month: number;
}

export interface BrandingSummary {
  name: string;
  totalBeginner: number;
  totalIntermediate: number;
  totalAdvanced: number;
  totalApproved: number;
  totalPoint: number;
  year: number;
  month: number;
}

export interface CompetitionSummary {
  name: string;
  totalNational: number;
  totalInternational: number;
  totalApproved: number;
  totalPoint: number;
  year: number;
  month: number;
}

export interface TotalPointSummary {
  name: string;
  totalPoint: number;
  year: number;
  month: number;
}

export default IKPI;
