import KPIRepository from "../repository/kpi.respository";
import { IKPIMaster, IKPIDetail } from "../models/kpi/kpi_item/kpi.item.interface";

const KPIItemService = {
  // KPI Master
  addMaster: async (data: Partial<IKPIMaster>): Promise<IKPIMaster> => {
    const allMasters = await KPIRepository.findAllMasters();
    const totalExisting = allMasters.reduce((sum, m) => sum + m.point, 0);
    const newTotal = totalExisting + (data.point || 0);

    if (newTotal > 100) {
      throw new Error(`Total weight of all departments must not exceed 100%. Current total is ${totalExisting}%, cannot add ${data.point}%`);
    }

    return await KPIRepository.createMaster(data);
  },

  findAllMasters: async (): Promise<IKPIMaster[]> => {
    return await KPIRepository.findAllMasters();
  },

  findMasterById: async (id: string): Promise<IKPIMaster | null> => {
    return await KPIRepository.findMasterById(id);
  },

  findMasterByKementerian: async (kementerian: string): Promise<IKPIMaster | null> => {
    return await KPIRepository.findMasterByKementerian(kementerian);
  },

  updateMaster: async (id: string, data: Partial<IKPIMaster>): Promise<IKPIMaster | null> => {
    if (data.point !== undefined) {
      const allMasters = await KPIRepository.findAllMasters();
      const totalLain = allMasters
        .filter((m) => m._id.toString() !== id)
        .reduce((sum, m) => sum + m.point, 0);
      const newTotal = totalLain + data.point;

      if (newTotal > 100) {
        throw new Error(`Total weight of all departments must not exceed 100%. Other departments total is ${totalLain}%, cannot set ${data.point}%`);
      }
    }

    return await KPIRepository.updateMaster(id, data);
  },

  deleteMaster: async (id: string): Promise<IKPIMaster | null> => {
    return await KPIRepository.deleteMaster(id);
  },

  // KPI Detail
  addDetail: async (data: Partial<IKPIDetail>): Promise<IKPIDetail> => {
    if (data.label === "REQUIRED" && data.id_kpi_master && data.point !== undefined) {
      const master = await KPIRepository.findMasterById(data.id_kpi_master.toString());
      if (!master) throw new Error("KPI Master not found");

      const existingDetails = await KPIRepository.findDetailsByMasterId(data.id_kpi_master.toString());
      const totalRequired = existingDetails
        .filter((d) => d.label === "REQUIRED")
        .reduce((sum, d) => sum + d.point, 0);

      const newTotal = totalRequired + data.point;
      if (newTotal > master.point) {
        throw new Error(`Total REQUIRED items must not exceed master weight (${master.point}%). Current total is ${totalRequired}%, cannot add ${data.point}%`);
      }
    }

    return await KPIRepository.createDetail(data);
  },

  findAllDetails: async (): Promise<IKPIDetail[]> => {
    return await KPIRepository.findAllDetails();
  },

  findDetailById: async (id: string): Promise<IKPIDetail | null> => {
    return await KPIRepository.findDetailById(id);
  },

  findDetailsByMasterId: async (masterId: string): Promise<IKPIDetail[]> => {
    return await KPIRepository.findDetailsByMasterId(masterId);
  },

  updateDetail: async (id: string, data: Partial<IKPIDetail>): Promise<IKPIDetail | null> => {
      if (data.point !== undefined) {
        const existingDetail = await KPIRepository.findDetailById(id);
        if (!existingDetail) throw new Error("KPI Detail not found");

        const label = data.label || existingDetail.label;
        const masterId = existingDetail.id_kpi_master.toString();

        if (label === "REQUIRED") {
          const master = await KPIRepository.findMasterById(masterId);
          if (!master) throw new Error("KPI Master not found");

          const allDetails = await KPIRepository.findDetailsByMasterId(masterId);
          const totalRequired = allDetails
            .filter((d) => d.label === "REQUIRED" && d._id.toString() !== id)
            .reduce((sum, d) => sum + d.point, 0);

          const newTotal = totalRequired + data.point;
          if (newTotal > master.point) {
            throw new Error(`Total REQUIRED items must not exceed master weight (${master.point}%). Other items total is ${totalRequired}%, cannot set ${data.point}%`);
          }
        }
      }

    return await KPIRepository.updateDetail(id, data);
  },

  deleteDetail: async (id: string): Promise<IKPIDetail | null> => {
    return await KPIRepository.deleteDetail(id);
  },
};

export default KPIItemService;