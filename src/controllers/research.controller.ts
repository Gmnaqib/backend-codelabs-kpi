import { Request, Response } from "express";
import researchService from "../services/research.service";
import response from "../helper/response";
import IResearch, { CategoryType, progressStatus, statusResearch } from "../models/research/research.interface";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middlewares";

const researchController = {
  createResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { week, category, research_type, title, link, progress, challenge } = req.body;
      const userId = req.user?.id;

      if (!userId || !week || !category || !research_type || !title || !link || !progress) {
        return response({
          res,
          code: 400,
          message: "Missing required fields: week, category, research_type, title, link, and progress are required",
        });
      }

      if (!Object.values(CategoryType).includes(category)) {
        return response({
          res,
          code: 400,
          message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}`,
        });
      }

      if (!Object.values(progressStatus).includes(progress)) {
        return response({
          res,
          code: 400,
          message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}`,
        });
      }

      const weekNumber = parseInt(week);
      if (isNaN(weekNumber) || weekNumber <= 0) {
        return response({
          res,
          code: 400,
          message: "Week must be a positive integer",
        });
      }

      const researchData: IResearch = {
        userId: new Types.ObjectId(userId),
        week: weekNumber,
        category,
        research_type,
        title,
        link,
        progress,
        challenge: challenge || null,
      };

      const newResearch = await researchService.createResearch(researchData);

      return response({
        res,
        code: 201,
        message: "Research record created successfully",
        data: newResearch,
      });
    } catch (error: any) {
      console.error("Error creating research:", error);

      if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        return response({
          res,
          code: 409,
          message: error.message,
        });
      } else if (error.message?.includes("required") || error.message?.includes("Invalid")) {
        return response({
          res,
          code: 400,
          message: error.message,
        });
      } else {
        return response({
          res,
          code: 500,
          message: "Failed to create research record",
        });
      }
    }
  },

  getAllResearch: async (req: Request, res: Response): Promise<any> => {
    try {
      const { week, category, progress, status, research_type, date } = req.query;

      const filters: any = {};

      if (week) {
        const weekNumber = parseInt(week as string);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          return response({
            res,
            code: 400,
            message: "Week must be a positive integer",
          });
        }
        filters.week = weekNumber;
      }

      if (category) {
        if (!Object.values(CategoryType).includes(category as CategoryType)) {
          return response({
            res,
            code: 400,
            message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}`,
          });
        }
        filters.category = category as CategoryType;
      }

      if (progress) {
        if (!Object.values(progressStatus).includes(progress as progressStatus)) {
          return response({
            res,
            code: 400,
            message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}`,
          });
        }
        filters.progress = progress as progressStatus;
      }

      if (status) {
        if (!Object.values(statusResearch).includes(status as statusResearch)) {
          return response({
            res,
            code: 400,
            message: `Invalid status. Must be one of: ${Object.values(statusResearch).join(", ")}`,
          });
        }
        filters.status = status as statusResearch;
      }

      if (research_type) {
        filters.research_type = research_type as string;
      }

      if (date) {
        const parsedDate = new Date(date as string);
        if (isNaN(parsedDate.getTime())) {
          return response({
            res,
            code: 400,
            message: "Invalid date format",
          });
        }
        
        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth() + 1;
        filters.date = { year, month };
      }

      const research = await researchService.getAllResearch(filters);

      return response({
        res,
        code: 200,
        message: "Research records retrieved successfully",
        data: research,
      });
    } catch (error: any) {
      console.error("Error getting research records:", error);
      return response({
        res,
        code: 500,
        message: "Failed to retrieve research records",
      });
    }
  },

  getMyResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return response({
          res,
          code: 401,
          message: "Authentication required",
        });
      }

      const research = await researchService.getResearchByUserId(userId);

      return response({
        res,
        code: 200,
        message: "User research records retrieved successfully",
        data: research,
      });
    } catch (error: any) {
      console.error("Error getting user research records:", error);
      return response({
        res,
        code: 500,
        message: "Failed to retrieve user research records",
      });
    }
  },

  getResearchById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return response({
          res,
          code: 400,
          message: "Invalid research ID format",
        });
      }

      const research = await researchService.getResearchById(id);

      if (!research) {
        return response({
          res,
          code: 404,
          message: "Research record not found",
        });
      }

      return response({
        res,
        code: 200,
        message: "Research record retrieved successfully",
        data: research,
      });
    } catch (error: any) {
      console.error("Error getting research record:", error);
      return response({
        res,
        code: 500,
        message: "Failed to retrieve research record",
      });
    }
  },

  updateResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.id;

      if (!Types.ObjectId.isValid(id)) {
        return response({
          res,
          code: 400,
          message: "Invalid research ID format",
        });
      }

      const existingResearch = await researchService.getResearchById(id);
      if (!existingResearch) {
        return response({
          res,
          code: 404,
          message: "Research record not found",
        });
      }

      //   if (req.user?.role !== "admin" && existingResearch.userId.toString() !== userId) {
      //     return response({
      //       res,
      //       code: 403,
      //       message: "You can only update your own research records",
      //     });
      //   }

      if (updateData.category && !Object.values(CategoryType).includes(updateData.category)) {
        return response({
          res,
          code: 400,
          message: `Invalid category. Must be one of: ${Object.values(CategoryType).join(", ")}`,
        });
      }

      if (updateData.progress && !Object.values(progressStatus).includes(updateData.progress)) {
        return response({
          res,
          code: 400,
          message: `Invalid progress. Must be one of: ${Object.values(progressStatus).join(", ")}`,
        });
      }

      if (updateData.status && !Object.values(statusResearch).includes(updateData.status)) {
        return response({
          res,
          code: 400,
          message: `Invalid status. Must be one of: ${Object.values(statusResearch).join(", ")}`,
        });
      }

      if (updateData.week) {
        const weekNumber = parseInt(updateData.week);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          return response({
            res,
            code: 400,
            message: "Week must be a positive integer",
          });
        }
        updateData.week = weekNumber;
      }

      if (updateData.userId && req.user?.role !== "admin") {
        delete updateData.userId;
      }

      const updatedResearch = await researchService.updateResearch(id, updateData);

      if (!updatedResearch) {
        return response({
          res,
          code: 404,
          message: "Research record not found",
        });
      }

      return response({
        res,
        code: 200,
        message: "Research record updated successfully",
        data: updatedResearch,
      });
    } catch (error: any) {
      console.error("Error updating research record:", error);

      if (error.message?.includes("not found")) {
        return response({
          res,
          code: 404,
          message: error.message,
        });
      } else if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        return response({
          res,
          code: 409,
          message: error.message,
        });
      } else if (error.message?.includes("Invalid") || error.message?.includes("required")) {
        return response({
          res,
          code: 400,
          message: error.message,
        });
      } else {
        return response({
          res,
          code: 500,
          message: "Failed to update research record",
        });
      }
    }
  },

  deleteResearch: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!Types.ObjectId.isValid(id)) {
        return response({
          res,
          code: 400,
          message: "Invalid research ID format",
        });
      }

      const existingResearch = await researchService.getResearchById(id);
      if (!existingResearch) {
        return response({
          res,
          code: 404,
          message: "Research record not found",
        });
      }

      const deletedResearch = await researchService.deleteResearch(id);

      if (!deletedResearch) {
        return response({
          res,
          code: 404,
          message: "Research record not found",
        });
      }

      return response({
        res,
        code: 200,
        message: "Research record deleted successfully",
        data: deletedResearch,
      });
    } catch (error: any) {
      console.error("Error deleting research record:", error);
      return response({
        res,
        code: 500,
        message: "Failed to delete research record",
      });
    }
  },
};

export default researchController;
