import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import KPICountService from "../services/kpi.count.services";
import userRepository from "../repository/user.repository";
import response from "../helper/response";
import { Status } from "../models/user/user.interface";

// ─── Helper: parse dateFilter dari query ─────────────────────────────────────

const parseDateFilter = (query: any): { year: number; month?: number } | undefined => {
  const { year, month } = query;
  if (!year) return undefined;

  const yearNum = parseInt(year as string);
  if (isNaN(yearNum) || yearNum < 1900) return undefined;

  const dateFilter: { year: number; month?: number } = { year: yearNum };

  if (month) {
    const monthNum = parseInt(month as string);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      dateFilter.month = monthNum;
    }
  }

  return dateFilter;
};

// ─── Controller ───────────────────────────────────────────────────────────────

const KPICountController = {

  // GET /kpi/me — KPI summary user sendiri
  getMyKPISummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const dateFilter = parseDateFilter(req.query);
      const summary = await KPICountService.getMyKPISummary(userId, dateFilter);
      return response({ res, code: 200, message: "KPI summary retrieved successfully", data: summary });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  // GET /kpi/ — KPI semua user (admin), sorted by grand_total + rank
  getAllKPISummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const dateFilter = parseDateFilter(req.query);
      const summaries = await KPICountService.getAllKPISummary(dateFilter);

      const currentUserRole = req.user?.role;

      let data = summaries.map((s, index) => ({
        rank: index + 1,
        userId: s.userId,
        name: s.name,
        grand_total: s.grand_total,
        categories: s.categories,
      }));

      // Non-admin tidak lihat data admin & lecturer
      if (currentUserRole !== "admin") {
        const allUsers = await userRepository.findAllUsers();
        const filteredIds = new Set(
          allUsers
            .filter((u: any) => u.role !== "admin" && u.role !== "lecturer")
            .map((u: any) => u._id.toString())
        );
        data = data.filter((d) => filteredIds.has(d.userId.toString()));
        data = data.map((d, index) => ({ ...d, rank: index + 1 }));
      }

      return response({ res, code: 200, message: "All KPI summaries retrieved successfully", data });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },

  // GET /kpi/summary/:userId — KPI summary user tertentu (admin)
  getKPISummaryByUserId: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.params.userId as string;
      if (!userId) {
        return response({ res, code: 400, message: "User ID is required" });
      }

      const dateFilter = parseDateFilter(req.query);
      const summary = await KPICountService.getMyKPISummary(userId, dateFilter);
      return response({ res, code: 200, message: "KPI summary retrieved successfully", data: summary });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default KPICountController;