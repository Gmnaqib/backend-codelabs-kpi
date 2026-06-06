import KPIRepository from "../repository/kpi.respository";
import { IKPIMaster, IKPIDetail } from "../models/kpi/kpi_item/kpi.item.interface";

const KPIItemService = {
  // ─── KPI Master ─────────────────────────────────────────────────────────────

  addMaster: async (data: Partial<IKPIMaster>): Promise<IKPIMaster> => {
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
    return await KPIRepository.updateMaster(id, data);
  },

  deleteMaster: async (id: string): Promise<IKPIMaster | null> => {
    return await KPIRepository.deleteMaster(id);
  },

  // ─── KPI Detail ─────────────────────────────────────────────────────────────

  addDetail: async (data: Partial<IKPIDetail>): Promise<IKPIDetail> => {
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
    return await KPIRepository.updateDetail(id, data);
  },

  deleteDetail: async (id: string): Promise<IKPIDetail | null> => {
    return await KPIRepository.deleteDetail(id);
  },
};

export default KPIItemService;