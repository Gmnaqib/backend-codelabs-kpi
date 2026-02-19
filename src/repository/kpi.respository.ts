import KPI from "../models/kpi/kpi_item/kpi.item.schema";
import IKPI from "../models/kpi/kpi_item/kpi.item.interface";
import { Types } from "mongoose";

interface KPIFilter {
  _id?: Types.ObjectId;
  category?: Types.ObjectId;
  code?: number;
}

const KPIRepository = {
  // CRUD operations for KPI items
  createKPI: (kpiData: Partial<IKPI>) => KPI.create(kpiData),
  findAllKPIs: () => KPI.find(),
  findKPIById: (id: string) => KPI.findById(new Types.ObjectId(id)),
  findKPIByFilter: (filter: KPIFilter) => KPI.find(filter),
  findKPIByCode: (code: string) => KPI.findOne({ code }),
  updateKPI: (id: string, kpiData: Partial<IKPI>) => KPI.updateOne({ _id: new Types.ObjectId(id) }, kpiData),
};

export default KPIRepository;
