import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import response from "../helper/response";
import BrandingService from "../services/branding.service";

const brandingController = {
  addBranding: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { name, description, link, status, research, level } = req.body;
      const newBranding = await BrandingService.addBranding(userId, name, description, link, status, research, level);
      return response({ res, code: 201, message: "Branding success created", data: newBranding });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findAllBrandings: async (req: Request, res: Response): Promise<any> => {
    try {
      const filters = req.query;
      const Brandings = await BrandingService.findBrandingsByFilter(filters);
      return response({ res, code: 200, message: "Get Brandings by filter success", data: Brandings });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  getMyBrandings: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return response({ res, code: 401, message: "Authentication required", data: null });
      }

      const brandings = await BrandingService.getMyBrandings(userId);
      return response({ res, code: 200, message: "Get my brandings success", data: brandings });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateMybrandings: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, description, link, research, level } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return response({ res, code: 401, message: "Authentication required", data: null });
      }

      const updatedBranding = await BrandingService.updateMyBranding(id, userId, { name, description, link, research, level });
      return response({ res, code: 200, message: "Update my branding success", data: updatedBranding });
    } catch (error: any) {
      if (error.message === "Branding not found") {
        return response({ res, code: 404, message: error.message, data: null });
      } else if (error.message === "You can only update your own brandings") {
        return response({ res, code: 403, message: error.message, data: null });
      }
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findBrandingById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const Branding = await BrandingService.findBrandingById(id);
      return response({ res, code: 201, message: "get Brandings by id success", data: Branding });
    } catch (error: any) {
      return response({ res, code: error.message === "Branding not found" ? 404 : 500, message: error.message, data: null });
    }
  },

  updateBranding: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, description, link, status, research, level } = req.body;

      const Branding = await BrandingService.updateBranding(id, { name, description, link, status, research, level });
      return response({ res, code: 201, message: "update Brandings success", data: Branding });
    } catch (error: any) {
      return response({ res, code: error.message === "Branding not found" ? 400 : 500, message: error.message, data: null });
    }
  },

  deleteBranding: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const deletedBranding = await BrandingService.deleteBranding(id);
      return response({ res, code: 201, message: "delete Brandings success", data: deletedBranding });
    } catch (error: any) {
      return response({ res, code: error.message === "Branding not found" ? 400 : 500, message: error.message, data: null });
    }
  },
};

export default brandingController;
