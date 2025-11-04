import KPIRepository from "../repository/kpi.respository";
import IKPI from "../models/kpi/kpi.interface";
import { Types } from "mongoose";

const KPIService = {
  addKPI: async (userId: string, attendance: number, research: number, competition: number, operational: number, branding: number): Promise<IKPI> => {
    const userObjectId = new Types.ObjectId(userId);
    return await KPIRepository.createKPI({
      userId: userObjectId,
      attendance,
      research,
      competition,
      operational,
      branding,
    });
  },

  findAllKPIs: async (): Promise<IKPI[]> => {
    return await KPIRepository.findAllKPIs();
  },

  findKPIsByFilter: async (filter: any): Promise<IKPI[]> => {
    const formattedFilter = { ...filter };
    if (filter.userId) formattedFilter.userId = new Types.ObjectId(filter.userId);

    return KPIRepository.findKPIByFilter(formattedFilter);
  },

  updateKPI: async (id: string, updateData: { attendance: number; research: number; competition: number; operational: number; branding: number }): Promise<IKPI> => {
    const { attendance, research, competition, operational, branding } = updateData;
    const KPI = await KPIRepository.findKPIById(id);

    if (!KPI) {
      throw new Error("KPI not found");
    }

    KPI.attendance = attendance || KPI.attendance;
    KPI.research = research || KPI.research;
    KPI.competition = competition || KPI.competition;
    KPI.operational = operational || KPI.operational;
    KPI.branding = branding || KPI.branding;

    await KPI.save();
    return KPI;
  },
};

export default KPIService;
