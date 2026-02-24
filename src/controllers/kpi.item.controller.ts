import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import response from "../helper/response";
import KPIItemService from "../services/kpi.services";

const KPIItemController = {
  addKPIItem: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { category, code, point } = req.body;
      const newKPIItem = await KPIItemService.addKPIItem(category, code, point);
      return response({ res, code: 201, message: "KPI item success created", data: newKPIItem });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
  getAllKPIItems: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const filter = req.query;
      if (!filter) {
        const kpiItems = await KPIItemService.findAllKPIItems();
        return response({ res, code: 200, message: "KPI items retrieved successfully", data: kpiItems });
      }
      const kpiItems = await KPIItemService.findKPIItemsByFilter(filter);
      return response({ res, code: 200, message: "KPI items retrieved successfully", data: kpiItems });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
  getKPIItemById: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const kpiItem = await KPIItemService.findKPIItemById(id);
      if (!kpiItem) {
        return response({ res, code: 404, message: "KPI item not found" });
      }
      return response({ res, code: 200, message: "KPI item retrieved successfully", data: kpiItem });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
  updateKPIItem: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const kpiData = req.body;
      const updatedKPIItem = await KPIItemService.updateKPIItem(id, kpiData);
      if (!updatedKPIItem) {
        return response({ res, code: 404, message: "KPI item not found" });
      }
      return response({ res, code: 200, message: "KPI item updated successfully", data: updatedKPIItem });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message });
    }
  },
};

export default KPIItemController;
