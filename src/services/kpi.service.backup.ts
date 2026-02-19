// import KPIRepository from "../repository/kpi.respository";
// import { CompetitionSummary, KPISummary, ResearchSummary, BrandingSummary, TotalPointSummary } from "../models/kpi/kpi.interface";
// import KPICalculator from "../helper/kpiCalculator";
// import Attendance from "../models/attendance/attendance.schema";
// import Research from "../models/research/research.schema";
// import User from "../models/user/user.schema";
// import Branding from "../models/branding/branding.schema";
// import Competition from "../models/competition/competition.schema";
// import { attendanceStatus } from "../models/attendance/attendance.Interface";
// import { statusResearch, progressStatus } from "../models/research/research.interface";
// import { brandingStatus } from "../models/branding/branding.interface";
// import { CompetitionStatus, CompetitionType } from "../models/competition/competition.interface";
// import { Types } from "mongoose";

// const KPIService = {
//   getKPISummary: async (userId: string, month: number, year: number): Promise<KPISummary> => {
//     try {
//       const userObjectId = new Types.ObjectId(userId);
//       const user = await User.findById(userObjectId);
//       if (!user) {
//         throw new Error("User not found");
//       }
//       const kpiList = await KPIRepository.findKPIByFilter({ userId: userObjectId, month, year });
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0, 23, 59, 59);

//       const attendanceRecords = await Attendance.find({
//         userId: userObjectId,
//         status: attendanceStatus.PRESENT,
//         checkIn: { $gte: startDate, $lte: endDate },
//       });

//       const totalAttendance = attendanceRecords.length;

//       let totalTematik = 0;
//       let totalPicket = 0;

//       if (kpiList && kpiList.length > 0) {
//         const scoring = kpiList[0].scoring || [];
//         totalTematik = scoring.filter((item) => item.activity === "Thematic").length;
//         totalPicket = scoring.filter((item) => item.activity === "Picker").length;
//       }

//       // Hitung total point real-time dari semua kategori
//       const calculatedScores = await KPICalculator.calculateAllScores(userObjectId, month, year);
//       const totalPoint = calculatedScores.attendance + calculatedScores.operational;

//       return {
//         name: user.name,
//         totalAttendance: totalAttendance,
//         totalTematik: totalTematik,
//         totalPicket: totalPicket,
//         totalPoint,
//         year: year,
//         month: month,
//       };
//     } catch (error: any) {
//       throw new Error(`Error getting KPI summary: ${error.message}`);
//     }
//   },

//   getResearchSummary: async (userId: string, month: number, year: number): Promise<ResearchSummary> => {
//     try {
//       const userObjectId = new Types.ObjectId(userId);
//       const user = await User.findById(userObjectId);
//       if (!user) {
//         throw new Error("User not found");
//       }
//       // Get research data dengan filter bulan dan tahun
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0, 23, 59, 59);

//       const researchRecords = await Research.find({
//         userId: userObjectId,
//         createdAt: { $gte: startDate, $lte: endDate },
//       });

//       // Count berdasarkan progress dan status
//       let totalUnfinished = 0;
//       let totalFinished = 0;
//       let totalApproved = 0;
//       let totalPoint = 0;

//       researchRecords.forEach((record) => {
//         // Count berdasarkan progress
//         if (record.progress === progressStatus.Unfinished) {
//           totalUnfinished++;
//         } else if (record.progress === progressStatus.Finished) {
//           totalFinished++;
//         }

//         // Count approved dan hitung point
//         if (record.status === statusResearch.approved) {
//           totalApproved++;
//           // Point calculation: APPROVED & FINISHED = 15, APPROVED & UNFINISHED = 5
//           totalPoint += record.progress === progressStatus.Finished ? 15 : 5;
//         }
//       });

//       return {
//         name: user.name,
//         totalUnfinished,
//         totalFinished,
//         totalApproved,
//         totalPoint,
//         year: year,
//         month: month,
//       };
//     } catch (error: any) {
//       throw new Error(`Error getting research summary: ${error.message}`);
//     }
//   },

//   getAllKPISummary: async (month: number, year: number): Promise<KPISummary[]> => {
//     try {
//       const allUsers = await User.find();
//       const summaries: KPISummary[] = [];

//       for (const user of allUsers) {
//         const summary = await KPIService.getKPISummary(user._id.toString(), month, year);
//         summaries.push(summary);
//       }

//       return summaries;
//     } catch (error: any) {
//       throw new Error(`Error getting all KPI summaries: ${error.message}`);
//     }
//   },

//   getAllResearchSummary: async (month: number, year: number): Promise<ResearchSummary[]> => {
//     try {
//       const allUsers = await User.find();
//       const summaries: ResearchSummary[] = [];

//       for (const user of allUsers) {
//         const summary = await KPIService.getResearchSummary(user._id.toString(), month, year);
//         summaries.push(summary);
//       }

//       return summaries;
//     } catch (error: any) {
//       throw new Error(`Error getting all research summaries: ${error.message}`);
//     }
//   },

//   getTotalPointSummary: async (userId: string, month: number, year: number): Promise<TotalPointSummary> => {
//     try {
//       const userObjectId = new Types.ObjectId(userId);

//       // Get user data
//       const user = await User.findById(userObjectId);
//       if (!user) {
//         throw new Error("User not found");
//       }

//       // Hitung total point dari semua kategori
//       const calculatedScores = await KPICalculator.calculateAllScores(userObjectId, month, year);
//       const totalPoint = calculatedScores.attendance + calculatedScores.research + calculatedScores.competition + calculatedScores.operational + calculatedScores.branding;

//       return {
//         name: user.name,
//         totalPoint,
//         year: year,
//         month: month,
//       };
//     } catch (error: any) {
//       throw new Error(`Error getting total point summary: ${error.message}`);
//     }
//   },

//   getAllTotalPointSummary: async (month: number, year: number): Promise<TotalPointSummary[]> => {
//     try {
//       const allUsers = await User.find();
//       const summaries: TotalPointSummary[] = [];

//       for (const user of allUsers) {
//         const summary = await KPIService.getTotalPointSummary(user._id.toString(), month, year);
//         summaries.push(summary);
//       }

//       return summaries;
//     } catch (error: any) {
//       throw new Error(`Error getting all total point summaries: ${error.message}`);
//     }
//   },
// };

// export default KPIService;
