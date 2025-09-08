import { Request, Response } from "express";
import settingRepository from "../repository/setting.respository";
import ISetting from "../models/setting/setting.interface";
import response from "../helper/response";

const settingController = {
  addSetting: async (req: Request, res: Response): Promise<any> => {
    const { code, name } = req.body;
    try {
      const newSetting: ISetting = await settingRepository.create({
        code,
        name,
      });
      return response({ res, code: 201, message: "setting success created", data: newSetting });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findAllSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const findAllSetting = await settingRepository.findAll();
      return response({ res, code: 201, message: "get all settings success", data: findAllSetting });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findSettingById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const findSettingById = await settingRepository.findById(id);
      return response({ res, code: 201, message: "get settings by id success", data: findSettingById });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { code, name, value } = req.body;
      const setting = await settingRepository.findById(id);

      if (!setting) {
        return response({ res, code: 400, message: "setting not found" });
      }

      setting.code = code || setting.code;
      setting.name = name || setting.name;
      setting.value = value || setting.value;

      await setting.save();

      return response({ res, code: 201, message: "update settings success", data: setting });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  deleteSetting: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const setting = await settingRepository.findById(id);

      if (!setting) {
        return response({ res, code: 400, message: "setting not found" });
      }
      const deleteSetting = await settingRepository.delete(id);
      return response({ res, code: 201, message: "delete setting success", data: deleteSetting });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },
};

export default settingController;
