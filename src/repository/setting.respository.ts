import Setting from "../models/setting/setting.schema";
import ISetting from "../models/setting/setting.interface";
import { Types } from "mongoose";

// Type-safe filter and update interfaces
interface SettingFilter {
  _id?: Types.ObjectId | string;
  code?: string;
  name?: string;
  value?: boolean | any;
}

interface SettingUpdate {
  code?: string;
  name?: string;
  value?: boolean | any;
}

const settingRepository = {
  createSetting: (settingData: Partial<ISetting>) => Setting.create(settingData),

  findAllSettings: () => Setting.find(),

  findSettingById: (id: string) => Setting.findById(id),

  findSetting: (filter: SettingFilter) => Setting.findOne(filter),

  findSettingByCode: (code: string) => Setting.findOne({ code }),

  updateSetting: (filter: SettingFilter, updateData: SettingUpdate) => Setting.updateOne(filter, updateData),

  updateSettingById: (id: string, updateData: SettingUpdate) => Setting.findByIdAndUpdate(id, updateData, { new: true }),

  deleteSetting: (id: string) => Setting.findByIdAndDelete(id),

  deleteSettingByFilter: (filter: SettingFilter) => Setting.deleteOne(filter),

  // Specific helper methods
  toggleSettingValue: (code: string) => Setting.findOneAndUpdate({ code }, [{ $set: { value: { $not: "$value" } } }], { new: true }),

  setSettingValue: (code: string, value: boolean | any) => Setting.findOneAndUpdate({ code }, { value }, { new: true, upsert: true }),
};

export default settingRepository;
