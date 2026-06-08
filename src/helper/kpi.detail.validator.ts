import { KPIDetail } from "../models/kpi/kpi_item/kpi.item.schema";
import { KPIMaster } from "../models/kpi/kpi_item/kpi.item.schema";

/**
 * Validasi bahwa id_kpi_detail yang diberikan milik kementerian yang benar.
 * Throws error jika tidak sesuai.
 */
export const validateKpiDetailKementerian = async (
  id_kpi_detail: string,
  expectedKementerian: string
): Promise<void> => {
  const detail = await KPIDetail.findById(id_kpi_detail);
  if (!detail) throw new Error("KPI detail not found");

  const master = await KPIMaster.findById(detail.id_kpi_master);
  if (!master) throw new Error("KPI master not found");

  if (master.kementerian.toLowerCase() !== expectedKementerian.toLowerCase()) {
    throw new Error(
      `Invalid KPI detail. Expected detail from '${expectedKementerian}' department, got '${master.kementerian}'`
    );
  }
};