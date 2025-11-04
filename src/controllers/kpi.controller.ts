import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import response from "../helper/response";
import KPIService from "../services/kpi.service";

const KPIController = {
  addKPI: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { attendance, research, competition, operational, branding } = req.body;
      const newKPI = await KPIService.addKPI(userId, attendance, research, competition, operational, branding);
      return response({ res, code: 201, message: "KPI success created", data: newKPI });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findAllKPIs: async (req: Request, res: Response): Promise<any> => {
    try {
      const filter = req.query;
      if (!filter) {
        const KPIs = await KPIService.findAllKPIs();
        return response({ res, code: 201, message: "get all KPIs success", data: KPIs });
      }
      const KPIs = await KPIService.findKPIsByFilter(filter);
      return response({ res, code: 200, message: "Get KPIs by filter success", data: KPIs });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findKPIById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const KPI = await KPIService.findKPIsByFilter({ _id: id });
      return response({ res, code: 201, message: "get KPIs by id success", data: KPI });
    } catch (error: any) {
      return response({ res, code: error.message === "KPI not found" ? 404 : 500, message: error.message, data: null });
    }
  },

  updateKPI: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { attendance, research, competition, operational, branding } = req.body;

      const KPI = await KPIService.updateKPI(id, { attendance, research, competition, operational, branding });
      return response({ res, code: 201, message: "update KPIs success", data: KPI });
    } catch (error: any) {
      return response({ res, code: error.message === "KPI not found" ? 400 : 500, message: error.message, data: null });
    }
  },
};

export default KPIController;
