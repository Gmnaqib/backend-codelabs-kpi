import Setting from "../models/setting/setting.schema";
import ISetting from "../models/setting/setting.interface";
import { Types } from "mongoose";

// Type-safe filter interface
interface SettingFilter {
  _id?: Types.ObjectId | string;
  code?: string;
  name?: string;
  value?: boolean;
}

const settingRepository = {
  // Create operations
  createSetting: (settingData: Partial<ISetting>) => Setting.create(settingData),

  // Find operations
  findAllSettings: () => Setting.find(),

  findSettingById: (id: string) => Setting.findById(id),

  findSetting: (filter: SettingFilter) => Setting.findOne(filter),

  findSettingsByFilter: (filter: SettingFilter) => Setting.find(filter),

  findSettingByCode: (code: string) => Setting.findOne({ code }),

  // Update operations
  updateSettingById: (id: string, updateData: Partial<ISetting>) => Setting.findByIdAndUpdate(id, updateData, { new: true }),

  updateSetting: (filter: SettingFilter, updateData: Partial<ISetting>) => Setting.updateOne(filter, updateData),

  updateSettingByCode: (code: string, updateData: Partial<ISetting>) => Setting.findOneAndUpdate({ code }, updateData, { new: true, upsert: true }),

  // Delete operations
  deleteSettingById: (id: string) => Setting.findByIdAndDelete(id),

  deleteSetting: (filter: SettingFilter) => Setting.deleteOne(filter),
};

export default settingRepository;
