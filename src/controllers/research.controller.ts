import { Request, Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middlewares";
import researchService from "../services/research.service";
import response from "../helper/response";
import IResearch, { CategoryType, progressStatus, statusResearch, ResearchStatus } from "../models/research/research.interface";

const researchController = {
  createResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { week, category, title, link, progress, challenge } = req.body;
      const userId = req.user?.id;

      if (!userId || !week || !category || !title || !link || !progress) {
        return response({ res, code: 400, message: "Missing required fields: week, category, title, link, and progress are required" });
      }

      if (!Object.values(CategoryType).includes(category)) {
        return response({ res, code: 400, message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}` });
      }

      if (!Object.values(progressStatus).includes(progress)) {
        return response({ res, code: 400, message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}` });
      }

      const weekNumber = parseInt(week);
      if (isNaN(weekNumber) || weekNumber <= 0) {
        return response({ res, code: 400, message: "Week must be a positive integer" });
      }

      const researchData: IResearch = {
        userId: new Types.ObjectId(userId),
        week: weekNumber,
        category,
        title,
        link,
        progress,
        challenge: challenge || null,
      };

      const newResearch = await researchService.createResearch(researchData);

      return response({ res, code: 201, message: "Research record created successfully", data: newResearch });
    } catch (error: any) {
      if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        return response({ res, code: 409, message: error.message });
      } else if (error.message?.includes("required") || error.message?.includes("Invalid")) {
        return response({ res, code: 400, message: error.message });
      } else {
        return response({ res, code: 500, message: "Failed to create research record" });
      }
    }
  },

  getAllResearch: async (req: Request, res: Response): Promise<any> => {
    try {
      const { week, category, progress, status, month, year } = req.query;
      const filters: any = {};
      if (week) {
        const weekNumber = parseInt(week as string);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          return response({ res, code: 400, message: "Week must be a positive integer" });
        }
        filters.week = weekNumber;
      }

      if (category) {
        if (!Object.values(CategoryType).includes(category as CategoryType)) {
          return response({ res, code: 400, message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}` });
        }
        filters.category = category as CategoryType;
      }

      if (progress) {
        if (!Object.values(progressStatus).includes(progress as progressStatus)) {
          return response({ res, code: 400, message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}` });
        }
        filters.progress = progress as progressStatus;
      }

      if (status) {
        const statusNum = Number(status);
        if (isNaN(statusNum) || statusNum < 0 || statusNum > 5) {
          return response({ res, code: 400, message: `Invalid status. Must be a number between 0 and 5` });
        }
        filters.status = statusNum;
      }

      if (month || year) {
        if (!year) {
          return response({ res, code: 400, message: "Year is required" });
        }

        const yearNum = parseInt(year as string);

        if (isNaN(yearNum) || yearNum < 1900) {
          return response({ res, code: 400, message: "Year must be a valid number" });
        }

        if (month) {
          const monthNum = parseInt(month as string);

          if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return response({ res, code: 400, message: "Month must be a number between 1 and 12" });
          }
          filters.date = { month: monthNum, year: yearNum };
        } else {
          filters.date = { year: yearNum };
        }
      }

      const research = await researchService.getAllResearch(filters);

      return response({ res, code: 200, message: "Research records retrieved successfully", data: research });
    } catch (error: any) {
      console.error("Error getting research records:", error);
      return response({ res, code: 500, message: "Failed to retrieve research records" });
    }
  },

  getMyResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }
      const research = await researchService.getMyResearch(userId);
      return response({ res, code: 200, message: "User research records retrieved successfully", data: research });
    } catch (error: any) {
      console.error("Error getting user research records:", error);
      return response({ res, code: 500, message: "Failed to retrieve user research records" });
    }
  },

  getResearchById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };

      if (!Types.ObjectId.isValid(id)) {
        return response({ res, code: 400, message: "Invalid research ID format" });
      }
      const research = await researchService.getResearchById(id);
      if (!research) {
        return response({ res, code: 404, message: "Research record not found" });
      }
      return response({ res, code: 200, message: "Research record retrieved successfully", data: research });
    } catch (error: any) {
      console.error("Error getting research record:", error);
      return response({ res, code: 500, message: "Failed to retrieve research record" });
    }
  },

  updateResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const updateData = req.body;

      if (!Types.ObjectId.isValid(id)) {
        return response({ res, code: 400, message: "Invalid research ID format" });
      }

      const existingResearch = await researchService.getResearchById(id as string);
      if (!existingResearch) {
        return response({ res, code: 404, message: "Research record not found" });
      }

      if (updateData.category && !Object.values(CategoryType).includes(updateData.category)) {
        return response({ res, code: 400, message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}` });
      }

      if (updateData.progress && !Object.values(progressStatus).includes(updateData.progress)) {
        return response({ res, code: 400, message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}` });
      }

      if (updateData.status !== undefined) {
        const statusNum = Number(updateData.status);
        if (isNaN(statusNum) || statusNum < 0 || statusNum > 5) {
          return response({ res, code: 400, message: `Invalid status. Must be a number between 0 and 5` });
        }
        updateData.status = statusNum;
      }

      if (updateData.week) {
        const weekNumber = parseInt(updateData.week);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          return response({ res, code: 400, message: "Week must be a positive integer" });
        }
        updateData.week = weekNumber;
      }

      if (updateData.userId && req.user?.role !== "admin") {
        delete updateData.userId;
      }

      const updatedResearch = await researchService.updateResearch(id as string, updateData);

      if (!updatedResearch) {
        return response({ res, code: 404, message: "Research record not found" });
      }

      return response({ res, code: 200, message: "Research record updated successfully", data: updatedResearch });
    } catch (error: any) {
      console.error("Error updating research record:", error);

      if (error.message?.includes("not found")) {
        return response({ res, code: 404, message: error.message });
      } else if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        return response({ res, code: 409, message: error.message });
      } else if (error.message?.includes("Invalid") || error.message?.includes("required")) {
        return response({ res, code: 400, message: error.message });
      } else {
        return response({ res, code: 500, message: "Failed to update research record" });
      }
    }
  },

  updateMyResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const { week, category, title, link, progress, challenge } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return response({ res, code: 401, message: "Authentication required" });
      }

      if (!Types.ObjectId.isValid(id)) {
        return response({ res, code: 400, message: "Invalid research ID format" });
      }

      const existingResearch = await researchService.getResearchByIdWithoutPopulate(id as string);
      if (!existingResearch) {
        return response({ res, code: 404, message: "Research record not found" });
      }

      if (existingResearch.userId.toString() !== userId) {
        return response({ res, code: 403, message: "You can only update your own research records" });
      }

      const updateData: any = {};

      if (week !== undefined) {
        const weekNumber = parseInt(week);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          return response({ res, code: 400, message: "Week must be a positive integer" });
        }
        updateData.week = weekNumber;
      }

      if (category !== undefined) {
        if (!Object.values(CategoryType).includes(category)) {
          return response({ res, code: 400, message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}` });
        }
        updateData.category = category;
      }

      if (title !== undefined) {
        updateData.title = title;
      }

      if (link !== undefined) {
        updateData.link = link;
      }

      if (progress !== undefined) {
        if (!Object.values(progressStatus).includes(progress)) {
          return response({ res, code: 400, message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}` });
        }
        updateData.progress = progress;
      }

      if (challenge !== undefined) {
        updateData.challenge = challenge;
      }

      const updatedResearch = await researchService.updateMyResearch(id as string, updateData);

      if (!updatedResearch) {
        return response({ res, code: 404, message: "Research record not found" });
      }

      return response({ res, code: 200, message: "Research record updated successfully", data: updatedResearch });
    } catch (error: any) {
      console.error("Error updating research record:", error);

      if (error.message?.includes("not found")) {
        return response({ res, code: 404, message: error.message });
      } else if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        return response({ res, code: 409, message: error.message });
      } else if (error.message?.includes("Invalid") || error.message?.includes("required")) {
        return response({ res, code: 400, message: error.message });
      } else {
        return response({ res, code: 500, message: "Failed to update research record" });
      }
    }
  },

  deleteResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user?.id;

      if (!Types.ObjectId.isValid(id)) {
        return response({ res, code: 400, message: "Invalid research ID format" });
      }

      const existingResearch = await researchService.getResearchById(id as string);
      if (!existingResearch) {
        return response({ res, code: 404, message: "Research record not found" });
      }

      const deletedResearch = await researchService.deleteResearch(id as string);

      if (!deletedResearch) {
        return response({ res, code: 404, message: "Research record not found" });
      }

      return response({ res, code: 200, message: "Research record deleted successfully", data: deletedResearch });
    } catch (error: any) {
      console.error("Error deleting research record:", error);
      return response({ res, code: 500, message: "Failed to delete research record" });
    }
  },

  getResearchSummary: async (req: Request, res: Response): Promise<any> => {
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

      const summary = await researchService.getResearchSummary(Object.keys(dateFilter).length > 0 ? dateFilter : undefined);
      return response({ res, code: 200, message: "Research summary retrieved successfully", data: summary });
    } catch (error: any) {
      console.error("Error getting research summary:", error);
      return response({ res, code: 500, message: "Failed to retrieve research summary" });
    }
  },

  // getMyResearchSummary: async (req: AuthRequest, res: Response): Promise<any> => {
  //   try {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       return response({ res, code: 401, message: "Authentication required" });
  //     }
  //     const summary = await researchService.getMyResearchSummary(userId);
  //     return response({ res, code: 200, message: "User research summary retrieved successfully", data: summary });
  //   } catch (error: any) {
  //     console.error("Error getting user research summary:", error);
  //     return response({ res, code: 500, message: "Failed to retrieve user research summary" });
  //   }
  // },
};

export default researchController;
