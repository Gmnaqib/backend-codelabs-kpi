import { Request, Response } from "express";
import response from "../helper/response";
import settingService from "../services/setting.service";

const settingController = {
  addSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const { code, name } = req.body;
      const newSetting = await settingService.addSetting(code, name);
      return response({ res, code: 201, message: "setting success created", data: newSetting });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findAllSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const settings = await settingService.findAllSettings();
      return response({ res, code: 201, message: "get all settings success", data: settings });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findSettingById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const setting = await settingService.findSettingById(id as string);
      return response({ res, code: 201, message: "get settings by id success", data: setting });
    } catch (error: any) {
      return response({ res, code: error.message === "Setting not found" ? 404 : 500, message: error.message, data: null });
    }
  },

  updateSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { code, name, value } = req.body;

      const setting = await settingService.updateSetting(id as string, { code, name, value });
      return response({ res, code: 201, message: "update settings success", data: setting });
    } catch (error: any) {
      return response({ res, code: error.message === "setting not found" ? 400 : 500, message: error.message, data: null });
    }
  },

  deleteSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const deletedSetting = await settingService.deleteSetting(id as string);
      return response({ res, code: 201, message: "delete setting success", data: deletedSetting });
    } catch (error: any) {
      return response({ res, code: error.message === "setting not found" ? 400 : 500, message: error.message, data: null });
    }
  },
};

export default settingController;
