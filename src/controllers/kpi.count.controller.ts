import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import KPICountService from "../services/kpi.count.services";
import KPIItemService from "../services/kpi.services";
import userRepository from "../repository/user.repository";
import response from "../helper/response";
import { Status } from "../models/user/user.interface";

const KPICountController = {
  getResearchPointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getResearchPointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Research points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting research points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve research points summary" });
    }
  },

  getMyResearchPointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMyResearchPointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Your research points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting my research points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your research points summary" });
    }
  },

  getAttendancePointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getAttendancePointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Attendance points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting attendance points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve attendance points summary" });
    }
  },

  getMyAttendancePointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMyAttendancePointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Your attendance points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting my attendance points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your attendance points summary" });
    }
  },

  getSchedulePointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getSchedulePointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Schedule points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting schedule points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve schedule points summary" });
    }
  },

  // Alias untuk operational (picket & thematic)
  getOperationalPointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getSchedulePointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Operational points summary (picket & thematic) retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting operational points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve operational points summary" });
    }
  },

  getMySchedulePointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMySchedulePointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Your schedule points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting my schedule points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your schedule points summary" });
    }
  },

  // Point operational user (picket & thematic)
  getMyOperationalPointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMySchedulePointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Your operational points summary (picket & thematic) retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting my operational points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your operational points summary" });
    }
  },
  kpiStatistic: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year } = req.query;

      if (!year) {
        return response({ res, code: 400, message: "year is required", data: null });
      }

      const statistics = await KPIItemService.getKpiStatistic(Number(year));
      return response({ res, code: 200, message: "KPI statistic retrieved successfully", data: statistics });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  getBrandingPointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getBrandingPointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Branding points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting branding points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve branding points summary" });
    }
  },

  getMyBrandingPointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMyBrandingPointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Your branding points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting my branding points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your branding points summary" });
    }
  },

  getCompetitionPointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getCompetitionPointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Competition points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting competition points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve competition points summary" });
    }
  },

  getMyCompetitionPointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMyCompetitionPointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Your competition points summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting my competition points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your competition points summary" });
    }
  },

  getTotalPointsSummary: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getTotalPointsSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);

      const pointsMap = new Map<string, number>();
      summary.byUser.forEach((user: any) => {
        pointsMap.set(user.userName, user.totalPoints);
      });
      console.log("Status enum:", Status);
      console.log("Looking for status:", Status.active);
      const allUsers = await userRepository.findUsersByFilter({ status: Status.active });
      console.log("Found active users:", allUsers.length);
      console.log("First user:", allUsers[0]);
      let simplifiedData = allUsers.map((user: any) => ({
        name: user.name,
        totalPoints: pointsMap.get(user.name) || 0,
      }));

      // Sort by totalPoints descending and add rank
      simplifiedData.sort((a, b) => b.totalPoints - a.totalPoints);
      simplifiedData = simplifiedData.map((user, index) => ({
        rank: index + 1,
        ...user,
      }));

      return response({ res, code: 200, message: "Total points summary retrieved successfully", data: simplifiedData });
    } catch (error: any) {
      console.error("Error getting total points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve total points summary" });
    }
  },

  getMyTotalPointsSummary: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      const { year, month } = req.query;
      const dateFilter: any = {};

      if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }
        dateFilter.year = yearNum;
      }

      if (month) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required when filtering by month" });
        }
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
        }
        dateFilter.month = monthNum;
      }

      const summary = await KPICountService.getMyTotalPointsSummary(userId, Object.keys(dateFilter).length > 0 ? dateFilter : undefined);

      // Return only name and total points
      const simplifiedData = {
        name: summary.userName,
        totalPoints: summary.totalPoints,
      };

      return response({ res, code: 200, message: "Your total points summary retrieved successfully", data: simplifiedData });
    } catch (error: any) {
      console.error("Error getting my total points summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve your total points summary" });
    }
  },
};

export default KPICountController;
