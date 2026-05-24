import KPIRepository from "../repository/kpi.respository";
import IKPIItem, { KPICategory } from "../models/kpi/kpi_item/kpi.item.interface";
import Attendance from "../models/attendance/attendance.schema";
import Research from "../models/research/research.schema";
import User from "../models/user/user.schema";
import Branding from "../models/branding/branding.schema";
import Competition from "../models/competition/competition.schema";
import { attendanceStatus } from "../models/attendance/attendance.Interface";
import { statusResearch, progressStatus } from "../models/research/research.interface";
import { brandingStatus } from "../models/branding/branding.interface";
import { CompetitionStatus, CompetitionType } from "../models/competition/competition.interface";
import IKPI, { BrandingSummary, CompetitionSummary, ResearchSummary, KPISummary } from "../models/kpi/kpi.interface";
import { Types } from "mongoose";

const KPIItemService = {
  addKPIItem: async (category: KPICategory, code: string, point: number): Promise<IKPIItem> => {
    return await KPIRepository.createKPI({ category, code, point });
  },
  updateKPIItem: async (id: string, kpiData: Partial<IKPIItem>): Promise<IKPIItem | null> => {
    const updatedKPI = await KPIRepository.updateKPI(id, kpiData);
    return await KPIRepository.findKPIById(id);
  },
  findAllKPIItems: async (): Promise<IKPIItem[]> => {
    return await KPIRepository.findAllKPIs();
  },
  findKPIItemById: async (id: string): Promise<IKPIItem | null> => {
    return await KPIRepository.findKPIById(id);
  },
  findKPIItemsByFilter: async (filter: any): Promise<IKPIItem[]> => {
    const formattedFilter = { ...filter };
    if (filter._id) formattedFilter._id = new Types.ObjectId(filter._id);
    if (filter.category) formattedFilter.category = filter.category;
    if (filter.code) formattedFilter.code = filter.code;
    return await KPIRepository.findKPIByFilter(formattedFilter);
  },
  getKpiStatistic: async (year: number): Promise<any> => {
    try {
      const monthlyStats = [];

      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Hitung total research untuk semua user di bulan tertentu
        const researchRecords = await Research.find({
          createdAt: { $gte: startDate, $lte: endDate },
        });

        // Hitung total attendance dengan status PRESENT untuk semua user di bulan tertentu
        const attendanceRecords = await Attendance.find({
          status: attendanceStatus.PRESENT,
          checkIn: { $gte: startDate, $lte: endDate },
        });

        const monthName = new Date(year, month - 1).toLocaleString("id-ID", { month: "long" });

        monthlyStats.push({
          month,
          monthName,
          totalResearch: researchRecords.length,
          totalAttendance: attendanceRecords.length,
        });
      }

      return {
        year,
        data: monthlyStats,
      };
    } catch (error: any) {
      throw new Error(`Error getting KPI statistic: ${error.message}`);
    }
  },
  getResearchStatistic: async (year: number): Promise<any> => {
    try {
      const monthlyStats = [];

      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Hitung total research dengan berbagai status di bulan tertentu
        const researchRecords = await Research.find({
          createdAt: { $gte: startDate, $lte: endDate },
        });

        const monthName = new Date(year, month - 1).toLocaleString("id-ID", { month: "long" });

        monthlyStats.push({
          month,
          monthName,
          totalResearch: researchRecords.length,
        });
      }

      return {
        year,
        data: monthlyStats,
      };
    } catch (error: any) {
      throw new Error(`Error getting research statistic: ${error.message}`);
    }
  },
  getResearchSummary: async (userId: string, month: number, year: number): Promise<ResearchSummary> => {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const user = await User.findById(userObjectId);
      if (!user) {
        throw new Error("User not found");
      }
      // Get research data dengan filter bulan dan tahun
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const researchRecords = await Research.find({
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Count berdasarkan progress dan status
      let totalUnfinished = 0;
      let totalFinished = 0;
      let totalApproved = 0;
      let totalPoint = 0;

      researchRecords.forEach((record) => {
        // Count berdasarkan progress
        if (record.progress === progressStatus.Unfinished) {
          totalUnfinished++;
        } else if (record.progress === progressStatus.Finished) {
          totalFinished++;
        }

        // Count approved dan hitung point
        if (record.status != null) {
          totalApproved++;
          // Point calculation: APPROVED & FINISHED = 15, APPROVED & UNFINISHED = 5
          const basePoint = record.progress === progressStatus.Finished ? 10 : 5;
          totalPoint += basePoint + record.status; // Tambahkan status sebagai poin tambahan (0-5)
        }
      });

      return {
        name: user.name,
        totalUnfinished,
        totalFinished,
        totalApproved,
        totalPoint,
        year: year,
        month: month,
      };
    } catch (error: any) {
      throw new Error(`Error getting research summary: ${error.message}`);
    }
  },
  getBrandingSummary: async (userId: string, month: number, year: number): Promise<BrandingSummary> => {
    try {
      const userObjectId = new Types.ObjectId(userId);

      // Get user data
      const user = await User.findById(userObjectId);
      if (!user) {
        throw new Error("User not found");
      }

      // Get branding data dengan filter bulan dan tahun
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const brandingRecords = await Branding.find({
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Count berdasarkan level dan hitung point
      let totalBeginner = 0;
      let totalIntermediate = 0;
      let totalAdvanced = 0;
      let totalApproved = 0;
      let totalPoint = 0;

      brandingRecords.forEach((record) => {
        if (record.status === brandingStatus.Approved) {
          totalApproved++;
          totalPoint += 15;
        }
      });

      return {
        name: user.name,
        totalBeginner,
        totalIntermediate,
        totalAdvanced,
        totalApproved,
        totalPoint,
        year: year,
        month: month,
      };
    } catch (error: any) {
      throw new Error(`Error getting branding summary: ${error.message}`);
    }
  },

  getAllBrandingSummary: async (month: number, year: number): Promise<BrandingSummary[]> => {
    try {
      const allUsers = await User.find();
      const summaries: BrandingSummary[] = [];

      for (const user of allUsers) {
        const summary = await KPIItemService.getBrandingSummary(user._id.toString(), month, year);
        summaries.push(summary);
      }

      return summaries;
    } catch (error: any) {
      throw new Error(`Error getting all branding summaries: ${error.message}`);
    }
  },

  getCompetitionSummary: async (userId: string, month: number, year: number): Promise<CompetitionSummary> => {
    try {
      const userObjectId = new Types.ObjectId(userId);

      // Get user data
      const user = await User.findById(userObjectId);
      if (!user) {
        throw new Error("User not found");
      }

      // Get competition data dengan filter bulan dan tahun
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const competitionRecords = await Competition.find({
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Count berdasarkan type dan hitung point
      let totalNational = 0;
      let totalInternational = 0;
      let totalApproved = 0;
      let totalPoint = 0;

      competitionRecords.forEach((record) => {
        // Count approved
        if (record.status === CompetitionStatus.Approved) {
          totalApproved++;

          // Count berdasarkan type dan hitung point
          if (record.type === CompetitionType.National) {
            totalNational++;
            totalPoint += 15;
          } else if (record.type === CompetitionType.International) {
            totalInternational++;
            totalPoint += 25;
          }
        }
      });

      return {
        name: user.name,
        totalNational,
        totalInternational,
        totalApproved,
        totalPoint,
        year: year,
        month: month,
      };
    } catch (error: any) {
      throw new Error(`Error getting competition summary: ${error.message}`);
    }
  },

  getAllCompetitionSummary: async (month: number, year: number): Promise<CompetitionSummary[]> => {
    try {
      const allUsers = await User.find();
      const summaries: CompetitionSummary[] = [];

      for (const user of allUsers) {
        const summary = await KPIItemService.getCompetitionSummary(user._id.toString(), month, year);
        summaries.push(summary);
      }

      return summaries;
    } catch (error: any) {
      throw new Error(`Error getting all competition summaries: ${error.message}`);
    }
  },

  getAllResearchSummary: async (month: number, year: number): Promise<ResearchSummary[]> => {
    try {
      const allUsers = await User.find();
      const summaries: ResearchSummary[] = [];

      for (const user of allUsers) {
        const summary = await KPIItemService.getResearchSummary(user._id.toString(), month, year);
        summaries.push(summary);
      }

      return summaries;
    } catch (error: any) {
      throw new Error(`Error getting all research summaries: ${error.message}`);
    }
  },
};

export default KPIItemService;
