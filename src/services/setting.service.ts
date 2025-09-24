import settingRepository from "../repository/setting.respository";
import ISetting from "../models/setting/setting.interface";

const settingService = {
  addSetting: async (code: string, name: string): Promise<ISetting> => {
    return await settingRepository.createSetting({
      code,
      name,
    });
  },

  findAllSettings: async (): Promise<ISetting[]> => {
    return await settingRepository.findAllSettings();
  },

  findSettingById: async (id: string): Promise<ISetting> => {
    const setting = await settingRepository.findSettingById(id);
    if (!setting) {
      throw new Error("Setting not found");
    }
    return setting;
  },

  updateSetting: async (id: string, updateData: { code?: string; name?: string; value?: any }): Promise<ISetting> => {
    const { code, name, value } = updateData;
    const setting = await settingRepository.findSettingById(id);

    if (!setting) {
      throw new Error("setting not found");
    }

    setting.code = code || setting.code;
    setting.name = name || setting.name;
    setting.value = value !== undefined ? value : setting.value;

    await setting.save();
    return setting;
  },

  deleteSetting: async (id: string): Promise<ISetting> => {
    const setting = await settingRepository.findSettingById(id);

    if (!setting) {
      throw new Error("setting not found");
    }

    const deletedSetting = await settingRepository.deleteSetting(id);
    return deletedSetting || setting;
  },
};

export default settingService;
