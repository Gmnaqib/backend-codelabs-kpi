import { Types } from "mongoose";

export enum KPILabel {
  WAJIB       = "WAJIB",
  TIDAK_WAJIB = "TIDAK_WAJIB",
}

export interface IKPIMaster {
  kementerian: string;
  point: number;
}

export interface IKPIDetail {
  kpi_item: string;
  point: number;
  id_kpi_master: Types.ObjectId;
  label: KPILabel;
  max_activity: number;
}

export default IKPIMaster;
