import Setting from "../models/setting/setting.schema";
import ISetting from "../models/setting/setting.interface";

const settingRepository = {
  create: (settingData: ISetting) => Setting.create(settingData),
  updateOne: (settingData: any) => Setting.updateOne(settingData),
  findById: (id: string) => Setting.findById(id),
  findAll: () => Setting.find(),
  delete: (id: string) => Setting.deleteOne({ _id: id }),
  findByCode: (code: string) => Setting.findOne({ code }),
};

export default settingRepository;
