// import KPI from "../models/kpi/kpi.schema";
// import IKPI from "../models/kpi/kpi.interface";
// import { Types } from "mongoose";

// interface KPIFilter {
//   _id?: Types.ObjectId | string;
//   userId?: Types.ObjectId | string;
//   month?: number;
//   year?: number;
//   attendance?: number;
//   research?: number;
//   competition?: number;
//   operational?: number;
//   branding?: number;
// }

// const KPIRepository = {
//   createKPI: (kpiData: Partial<IKPI>) => KPI.create(kpiData),
//   updateKPI: (id: string, kpiData: Partial<IKPI>) => KPI.updateOne({ id: new Types.ObjectId(id) }, kpiData),
//   findAllKPIs: () => KPI.find(),
//   findKPIByFilter: (filter: KPIFilter) => KPI.find(filter),
//   findKPIById: (id: string) => KPI.findById(new Types.ObjectId(id)),
// };

// export default KPIRepository;
