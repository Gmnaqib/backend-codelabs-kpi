import KPIRepository from "../repository/kpi.respository";
import researchRepository from "../repository/research.repository";
import attendanceRepository from "../repository/attendance.repository";
import operationalRecordRepository from "../repository/operationalRecord.repository";
import brandingRepository from "../repository/branding.respository";
import competitionRepository from "../repository/competition.respository";
import userRepository from "../repository/user.repository";
import { attendanceStatus } from "../models/attendance/attendance.Interface";
import { CompetitionStatus } from "../models/competition/competition.interface";
import { Types } from "mongoose";

const buildDateFilter = (dateFilter?: { year: number; month?: number }) => {
  if (!dateFilter) return null;
  if (dateFilter.month) {
    return {
      $gte: new Date(dateFilter.year, dateFilter.month - 1, 1),
      $lte: new Date(dateFilter.year, dateFilter.month, 0, 23, 59, 59, 999),
    };
  }
  return {
    $gte: new Date(dateFilter.year, 0, 1),
    $lte: new Date(dateFilter.year, 11, 31, 23, 59, 59, 999),
  };
};

// WAJIB  : di-cap maksimal = point detail
// TIDAK_WAJIB : bebas, bisa melebihi bobot item (bonus)
const hitungPoint = (point: number, maxActivity: number, jumlahActivity: number, label: string): number => {
  const pointPerActivity = point / maxActivity;
  const raw = pointPerActivity * jumlahActivity;
  const result = label === "WAJIB" ? Math.min(raw, point) : raw;
  return parseFloat(result.toFixed(4));
};

// Khusus item yang pakai range nilai 0-5
const hitungPointRange = (point: number, maxActivity: number, nilaiStatus: number, label: string): number => {
  const pointRangePer1 = point / maxActivity / 5;
  const raw = pointRangePer1 * nilaiStatus;
  const result = label === "WAJIB" ? Math.min(raw, point) : raw;
  return parseFloat(result.toFixed(4));
};

// Service

const KPICountService = {

  getMyKPISummary: async (
    userId: string,
    dateFilter?: { year: number; month?: number }
  ) => {
    const userObjectId = new Types.ObjectId(userId);
    const user = await userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    const dateRange = buildDateFilter(dateFilter);
    const masters = await KPIRepository.findAllMasters();
    const categories = [];

    for (const master of masters) {
      const details = await KPIRepository.findDetailsByMasterId(master._id.toString());
      const detailResults = [];

      for (const detail of details) {
        let jumlah_activity = 0;
        let point_akhir = 0;
        const kementerian = master.kementerian.toLowerCase();
        const detailId = detail._id.toString();

        if (kementerian === "operational") {
          const attendanceRecords = await attendanceRepository.findAll({
            userId: userObjectId,
            id_kpi_detail: detail._id,
            status: attendanceStatus.PRESENT,
            checkOut: { $ne: null } as any,
            ...(dateRange && { createdAt: dateRange }),
          });
          const operationalRecords = await operationalRecordRepository.findRecordsWithFilters({
            userId,
            id_kpi_detail: detailId,
            ...(dateFilter && {
              startDate: new Date(dateFilter.year, (dateFilter.month ?? 1) - 1, 1),
              endDate: new Date(dateFilter.year, dateFilter.month ?? 12, 0, 23, 59, 59, 999),
            }),
          });
          jumlah_activity = attendanceRecords.length + operationalRecords.length;
          point_akhir = hitungPoint(detail.point, detail.max_activity, jumlah_activity, detail.label);

        } else if (kementerian === "research") {
          const records = await researchRepository.findResearchWithFilters({
            userId,
            id_kpi_detail: detailId,
            status: { $ne: null } as any,
            ...(dateFilter && { date: dateFilter }),
          });
          jumlah_activity = records.length;
          const rawTotal = records.reduce((sum: number, r: any) => {
            return sum + hitungPointRange(detail.point, detail.max_activity, r.status || 0, detail.label);
          }, 0);
          point_akhir = parseFloat(rawTotal.toFixed(4));

        } else if (kementerian === "branding") {
          const records = await brandingRepository.findBrandingsByFilter(
            { userId: userObjectId, id_kpi_detail: detail._id, status: { $ne: null } },
            dateFilter
              ? { year: dateFilter.year, month: dateFilter.month ?? new Date().getMonth() + 1 }
              : undefined
          );
          jumlah_activity = records.length;
          const rawBranding = records.reduce((sum: number, r: any) => {
            return sum + hitungPointRange(detail.point, detail.max_activity, r.status || 0, detail.label);
          }, 0);
          point_akhir = parseFloat(rawBranding.toFixed(4));

        } else if (kementerian === "competition") {
          const records = await competitionRepository.findCompetitionsByFilter(
            { userId: userObjectId, id_kpi_detail: detail._id, status: CompetitionStatus.Approved },
            dateFilter
              ? { year: dateFilter.year, month: dateFilter.month ?? new Date().getMonth() + 1 }
              : undefined
          );
          jumlah_activity = records.length;
          point_akhir = hitungPoint(detail.point, detail.max_activity, jumlah_activity, detail.label);
        }

        detailResults.push({
          kpiDetailId: detail._id,
          kpi_item: detail.kpi_item,
          label: detail.label,
          point_per_activity: parseFloat((detail.point / detail.max_activity).toFixed(4)),
          jumlah_activity,
          point_akhir,
        });
      }

      const total_point = parseFloat(
        detailResults.reduce((sum, d) => sum + d.point_akhir, 0).toFixed(4)
      );

      categories.push({
        kementerian: master.kementerian,
        bobot_master: master.point,
        details: detailResults,
        total_point,
      });
    }

    const grand_total = parseFloat(
      categories.reduce((sum, c) => sum + c.total_point, 0).toFixed(4)
    );

    return {
      userId: userObjectId,
      name: user.name,
      month: dateFilter?.month ?? new Date().getMonth() + 1,
      year: dateFilter?.year ?? new Date().getFullYear(),
      categories,
      grand_total,
    };
  },

  getAllKPISummary: async (
    dateFilter?: { year: number; month?: number }
  ) => {
    const allUsers = await userRepository.findAllUsers();
    const summaries = [];

    for (const user of allUsers) {
      const summary = await KPICountService.getMyKPISummary(user._id.toString(), dateFilter);
      summaries.push(summary);
    }

    return summaries.sort((a, b) => b.grand_total - a.grand_total);
  },
};

export default KPICountService;