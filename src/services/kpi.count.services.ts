import IResearch, { CategoryType, progressStatus, statusResearch } from "../models/research/research.interface";
import researchRepository from "../repository/research.repository";
import KPIRepository from "../repository/kpi.respository";
import attendanceRepository from "../repository/attendance.repository";
import operationalRecordRepository from "../repository/operationalRecord.repository";
import brandingRepository from "../repository/branding.respository";
import competitionRepository from "../repository/competition.respository";
import userRepository from "../repository/user.repository";
import { attendanceStatus } from "../models/attendance/attendance.Interface";
import { ScheduleType } from "../models/schedule/schedule.interface";
import IBranding, { brandingStatus } from "../models/branding/branding.interface";
import ICompetition, { CompetitionStatus } from "../models/competition/competition.interface";

const KPICountService = {
  getResearchSummary: async (dateFilter?: { year: number; month?: number }) => {
    const approvedResearch = await researchRepository.findResearchWithFilters({
      status: statusResearch.approved,
      ...(dateFilter && { date: dateFilter }),
    });

    // Group by user
    const userMap = new Map<string, { userName: string; data: IResearch[] }>();

    approvedResearch.forEach((research) => {
      const userId = (research.userId as any)?._id?.toString() || research.userId.toString();
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userName: (research.userId as any)?.name || "Unknown User",
          data: [],
        });
      }
      userMap.get(userId)!.data.push(research);
    });

    // Build summary per user
    const byUser = Array.from(userMap.entries()).map(([userId, userData]) => {
      const categoryCounts = {
        [CategoryType.Personal]: 0,
        [CategoryType.Product]: 0,
        [CategoryType.workshop]: 0,
      };

      userData.data.forEach((research) => {
        categoryCounts[research.category]++;
      });

      return {
        userId,
        userName: userData.userName,
        total: userData.data.length,
        byCategory: categoryCounts,
        data: userData.data,
      };
    });

    return {
      totalApproved: approvedResearch.length,
      byUser,
    };
  },

  getResearchPointsSummary: async (dateFilter?: { year: number; month?: number }) => {
    // Get research summary grouped by user
    const researchSummary = await KPICountService.getResearchSummary(dateFilter);

    // Get KPI points for each code
    const coCreationKPI = await KPIRepository.findKPIByCode("COCREATION");
    const workshopKPI = await KPIRepository.findKPIByCode("WORKSHOP");

    const coCreationPoint = coCreationKPI?.point || 0;
    const workshopPoint = workshopKPI?.point || 0;

    // Calculate points for each user
    const byUserWithPoints = researchSummary.byUser.map((user) => {
      const personalPoints = user.byCategory[CategoryType.Personal] * coCreationPoint;
      const productPoints = user.byCategory[CategoryType.Product] * coCreationPoint;
      const workshopPoints = user.byCategory[CategoryType.workshop] * workshopPoint;

      const totalPoints = personalPoints + productPoints + workshopPoints;

      return {
        userId: user.userId,
        userName: user.userName,
        total: user.total,
        totalPoints,
        byCategory: {
          personal: {
            count: user.byCategory[CategoryType.Personal],
            code: "COCREATION",
            point: coCreationPoint,
            total: personalPoints,
          },
          product: {
            count: user.byCategory[CategoryType.Product],
            code: "COCREATION",
            point: coCreationPoint,
            total: productPoints,
          },
          workshop: {
            count: user.byCategory[CategoryType.workshop],
            code: "WORKSHOP",
            point: workshopPoint,
            total: workshopPoints,
          },
        },
      };
    });

    return {
      totalApproved: researchSummary.totalApproved,
      byUser: byUserWithPoints,
    };
  },

  getMyResearchPointsSummary: async (userId: string, dateFilter?: { year: number; month?: number }) => {
    // Get approved research for specific user
    const approvedResearch = await researchRepository.findResearchWithFilters({
      userId,
      status: statusResearch.approved,
      ...(dateFilter && { date: dateFilter }),
    });

    // Get KPI points for each code
    const coCreationKPI = await KPIRepository.findKPIByCode("COCREATION");
    const workshopKPI = await KPIRepository.findKPIByCode("WORKSHOP");

    const coCreationPoint = coCreationKPI?.point || 0;
    const workshopPoint = workshopKPI?.point || 0;

    // Count by category
    const categoryCounts = {
      [CategoryType.Personal]: 0,
      [CategoryType.Product]: 0,
      [CategoryType.workshop]: 0,
    };

    approvedResearch.forEach((research) => {
      categoryCounts[research.category]++;
    });

    // Calculate points
    const personalPoints = categoryCounts[CategoryType.Personal] * coCreationPoint;
    const productPoints = categoryCounts[CategoryType.Product] * coCreationPoint;
    const workshopPoints = categoryCounts[CategoryType.workshop] * workshopPoint;
    const totalPoints = personalPoints + productPoints + workshopPoints;

    return {
      userId,
      userName: (approvedResearch[0]?.userId as any)?.name,
      total: approvedResearch.length,
      totalPoints,
      byCategory: {
        personal: {
          count: categoryCounts[CategoryType.Personal],
          code: "COCREATION",
          point: coCreationPoint,
          total: personalPoints,
        },
        product: {
          count: categoryCounts[CategoryType.Product],
          code: "COCREATION",
          point: coCreationPoint,
          total: productPoints,
        },
        workshop: {
          count: categoryCounts[CategoryType.workshop],
          code: "WORKSHOP",
          point: workshopPoint,
          total: workshopPoints,
        },
      },
    };
  },

  getAttendancePointsSummary: async (dateFilter?: { year: number; month?: number }) => {
    // Build query filter for attendance records
    const query: any = {
      status: attendanceStatus.PRESENT,
    };

    // Add date range filter if provided
    if (dateFilter) {
      if (dateFilter.month) {
        const startDate = new Date(dateFilter.year, dateFilter.month - 1, 1);
        const endDate = new Date(dateFilter.year, dateFilter.month, 0, 23, 59, 59, 999);
        query.createdAt = { $gte: startDate, $lte: endDate };
      } else if (dateFilter.year) {
        const startDate = new Date(dateFilter.year, 0, 1);
        const endDate = new Date(dateFilter.year, 11, 31, 23, 59, 59, 999);
        query.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    // Get all attendance records with PRESENT status
    let attendanceRecords = await attendanceRepository.findAll(query);

    // Filter records where checkOut is not null and not undefined
    attendanceRecords = attendanceRecords.filter((record) => record.checkOut !== null && record.checkOut !== undefined);

    // Get KPI points for ATTENDANCE code
    const attendanceKPI = await KPIRepository.findKPIByCode("ATTENDANCE");
    const attendancePoint = attendanceKPI?.point || 0;

    // Group by user and collect unique userIds
    const userMap = new Map<string, { count: number }>();
    const userIds = new Set<string>();

    attendanceRecords.forEach((record) => {
      const userId = (record.userId as any)?._id?.toString() || record.userId.toString();
      userIds.add(userId);
      if (!userMap.has(userId)) {
        userMap.set(userId, { count: 0 });
      }
      const userData = userMap.get(userId)!;
      userData.count++;
    });

    // Fetch user data for all users
    const userDataMap = new Map<string, any>();
    for (const userId of userIds) {
      const user = await userRepository.findUserById(userId);
      userDataMap.set(userId, user);
    }

    // Calculate points for each user
    const byUserWithPoints = Array.from(userMap.entries()).map(([userId, userData]) => {
      const user = userDataMap.get(userId);
      const userName = user?.name || "Unknown User";
      const totalPoints = userData.count * attendancePoint;

      return {
        userId,
        userName,
        total: userData.count,
        totalPoints,
        detail: {
          present: {
            count: userData.count,
            code: "ATTENDANCE",
            point: attendancePoint,
            total: totalPoints,
          },
        },
      };
    });

    return {
      totalPresent: attendanceRecords.length,
      byUser: byUserWithPoints,
    };
  },

  getMyAttendancePointsSummary: async (userId: string, dateFilter?: { year: number; month?: number }) => {
    // Build query filter for attendance records
    const query: any = {
      userId: userId as any,
      status: attendanceStatus.PRESENT,
    };

    // Add date range filter if provided
    if (dateFilter) {
      if (dateFilter.month) {
        const startDate = new Date(dateFilter.year, dateFilter.month - 1, 1);
        const endDate = new Date(dateFilter.year, dateFilter.month, 0, 23, 59, 59, 999);
        query.createdAt = { $gte: startDate, $lte: endDate };
      } else if (dateFilter.year) {
        const startDate = new Date(dateFilter.year, 0, 1);
        const endDate = new Date(dateFilter.year, 11, 31, 23, 59, 59, 999);
        query.createdAt = { $gte: startDate, $lte: endDate };
      }
    }

    // Get attendance records for specific user with PRESENT status
    let attendanceRecords = await attendanceRepository.findAll(query);

    // Filter records where checkOut is not null and not undefined
    attendanceRecords = attendanceRecords.filter((record) => record.checkOut !== null && record.checkOut !== undefined);

    // Get KPI points for ATTENDANCE code
    const attendanceKPI = await KPIRepository.findKPIByCode("ATTENDANCE");
    const attendancePoint = attendanceKPI?.point || 0;

    // Fetch user data
    const user = await userRepository.findUserById(userId);
    const userName = user?.name || "Unknown User";

    const totalPoints = attendanceRecords.length * attendancePoint;

    return {
      userId,
      userName,
      total: attendanceRecords.length,
      totalPoints,
      detail: {
        present: {
          count: attendanceRecords.length,
          code: "ATTENDANCE",
          point: attendancePoint,
          total: totalPoints,
        },
      },
    };
  },

  getSchedulePointsSummary: async (dateFilter?: { year: number; month?: number }) => {
    // Get all operational records
    const operationalRecords = await operationalRecordRepository.findAllRecords();

    // Filter by date if provided
    let filteredRecords = operationalRecords;
    if (dateFilter) {
      const startDate = new Date(dateFilter.year, dateFilter.month ? dateFilter.month - 1 : 0, 1);
      const endDate = dateFilter.month ? new Date(dateFilter.year, dateFilter.month, 0, 23, 59, 59, 999) : new Date(dateFilter.year, 11, 31, 23, 59, 59, 999);

      filteredRecords = operationalRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Get KPI points for PICKET and THEMATIC
    const picketKPI = await KPIRepository.findKPIByCode("PICKET");
    const thematicKPI = await KPIRepository.findKPIByCode("THEMATIC");

    const picketPoint = picketKPI?.point || 0;
    const thematicPoint = thematicKPI?.point || 0;

    // Group by user and collect unique userIds
    const userMap = new Map<string, { picket: number; thematic: number }>();
    const userIds = new Set<string>();

    filteredRecords.forEach((record) => {
      // Skip records with null userId
      if (!record.userId) return;

      const userId = (record.userId as any)?._id?.toString() || record.userId.toString();
      userIds.add(userId);
      if (!userMap.has(userId)) {
        userMap.set(userId, { picket: 0, thematic: 0 });
      }

      const userData = userMap.get(userId)!;
      if (record.type === ScheduleType.picket) {
        userData.picket++;
      } else if (record.type === ScheduleType.thematic) {
        userData.thematic++;
      }
    });

    // Fetch user data for all users
    const userDataMap = new Map<string, any>();
    for (const userId of userIds) {
      const user = await userRepository.findUserById(userId);
      userDataMap.set(userId, user);
    }

    // Calculate points for each user
    const byUserWithPoints = Array.from(userMap.entries()).map(([userId, userData]) => {
      const user = userDataMap.get(userId);
      const userName = user?.name || "Unknown User";
      const picketPoints = userData.picket * picketPoint;
      const thematicPoints = userData.thematic * thematicPoint;
      const totalPoints = picketPoints + thematicPoints;

      return {
        userId,
        userName,
        total: userData.picket + userData.thematic,
        totalPoints,
        byScheduleType: {
          picket: {
            count: userData.picket,
            code: "PICKET",
            point: picketPoint,
            total: picketPoints,
          },
          thematic: {
            count: userData.thematic,
            code: "THEMATIC",
            point: thematicPoint,
            total: thematicPoints,
          },
        },
      };
    });

    return {
      totalSchedules: filteredRecords.length,
      byUser: byUserWithPoints,
    };
  },

  getMySchedulePointsSummary: async (userId: string, dateFilter?: { year: number; month?: number }) => {
    // Get operational records for specific user
    const operationalRecords = await operationalRecordRepository.findRecordsByUserId(userId);

    // Filter by date if provided
    let filteredRecords = operationalRecords;
    if (dateFilter) {
      const startDate = new Date(dateFilter.year, dateFilter.month ? dateFilter.month - 1 : 0, 1);
      const endDate = dateFilter.month ? new Date(dateFilter.year, dateFilter.month, 0, 23, 59, 59, 999) : new Date(dateFilter.year, 11, 31, 23, 59, 59, 999);

      filteredRecords = operationalRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Get KPI points for PICKET and THEMATIC
    const picketKPI = await KPIRepository.findKPIByCode("PICKET");
    const thematicKPI = await KPIRepository.findKPIByCode("THEMATIC");

    const picketPoint = picketKPI?.point || 0;
    const thematicPoint = thematicKPI?.point || 0;

    // Count by schedule type
    let picketCount = 0;
    let thematicCount = 0;

    filteredRecords.forEach((record) => {
      if (record.type === ScheduleType.picket) {
        picketCount++;
      } else if (record.type === ScheduleType.thematic) {
        thematicCount++;
      }
    });

    // Fetch user data
    const user = await userRepository.findUserById(userId);
    const userName = user?.name || "Unknown User";

    const picketPoints = picketCount * picketPoint;
    const thematicPoints = thematicCount * thematicPoint;
    const totalPoints = picketPoints + thematicPoints;

    return {
      userId,
      userName,
      total: picketCount + thematicCount,
      totalPoints,
      byScheduleType: {
        picket: {
          count: picketCount,
          code: "PICKET",
          point: picketPoint,
          total: picketPoints,
        },
        thematic: {
          count: thematicCount,
          code: "THEMATIC",
          point: thematicPoint,
          total: thematicPoints,
        },
      },
    };
  },

  // Branding Points Summary
  getBrandingPointsSummary: async (dateFilter?: { year: number; month?: number }) => {
    // Fetch all approved branding records
    const approvedBrandings = await brandingRepository.findBrandingsByFilter({ status: brandingStatus.Approved }, dateFilter ? { year: dateFilter.year, month: dateFilter.month || 1 } : undefined);

    // Handle date filtering if only year is provided
    let filteredBrandings = approvedBrandings;
    if (dateFilter && !dateFilter.month) {
      const startDate = new Date(dateFilter.year, 0, 1);
      const endDate = new Date(dateFilter.year, 11, 31, 23, 59, 59, 999);
      filteredBrandings = approvedBrandings.filter((branding) => {
        if (!branding.createdAt) return false;
        const brandingDate = new Date(branding.createdAt);
        return brandingDate >= startDate && brandingDate <= endDate;
      });
    }

    // Group by userId
    const userMap = new Map<string, IBranding[]>();
    filteredBrandings.forEach((branding) => {
      if (!branding.userId) return;
      const userId = (branding.userId as any)?._id?.toString() || branding.userId.toString();
      if (!userMap.has(userId)) {
        userMap.set(userId, []);
      }
      userMap.get(userId)!.push(branding);
    });

    // Get KPI point for CONTENT code
    const contentKPI = await KPIRepository.findKPIByCode("CONTENT");
    const contentPoint = contentKPI?.point || 0;

    // Build summary per user
    const summary = await Promise.all(
      Array.from(userMap.entries()).map(async ([userId, brandings]) => {
        const user = await userRepository.findUserById(userId);
        const userName = user?.name || "Unknown User";
        const count = brandings.length;
        const totalPoints = count * contentPoint;

        return {
          userId,
          userName,
          count,
          code: "CONTENT",
          point: contentPoint,
          totalPoints,
        };
      }),
    );

    return summary;
  },

  getMyBrandingPointsSummary: async (userId: string, dateFilter?: { year: number; month?: number }) => {
    // Fetch user's approved branding records
    const approvedBrandings = await brandingRepository.findMyBrandings(userId, dateFilter?.year, dateFilter?.month);

    // Filter by approved status
    const filteredBrandings = approvedBrandings.filter((branding) => branding.status === brandingStatus.Approved);

    // Get KPI point for CONTENT code
    const contentKPI = await KPIRepository.findKPIByCode("CONTENT");
    const contentPoint = contentKPI?.point || 0;

    // Calculate total
    const count = filteredBrandings.length;
    const totalPoints = count * contentPoint;

    // Fetch user data
    const user = await userRepository.findUserById(userId);
    const userName = user?.name || "Unknown User";

    return {
      userId,
      userName,
      count,
      code: "CONTENT",
      point: contentPoint,
      totalPoints,
    };
  },

  // Competition Points Summary
  getCompetitionPointsSummary: async (dateFilter?: { year: number; month?: number }) => {
    // Fetch all approved competition records
    const approvedCompetitions = await competitionRepository.findCompetitionsByFilter(
      { status: CompetitionStatus.Approved },
      dateFilter ? { year: dateFilter.year, month: dateFilter.month || 1 } : undefined,
    );

    // Handle date filtering if only year is provided
    let filteredCompetitions = approvedCompetitions;
    if (dateFilter && !dateFilter.month) {
      const startDate = new Date(dateFilter.year, 0, 1);
      const endDate = new Date(dateFilter.year, 11, 31, 23, 59, 59, 999);
      filteredCompetitions = approvedCompetitions.filter((competition) => {
        if (!competition.createdAt) return false;
        const competitionDate = new Date(competition.createdAt);
        return competitionDate >= startDate && competitionDate <= endDate;
      });
    }

    // Group by userId
    const userMap = new Map<string, ICompetition[]>();
    filteredCompetitions.forEach((competition) => {
      if (!competition.userId) return;
      const userId = (competition.userId as any)?._id?.toString() || competition.userId.toString();
      if (!userMap.has(userId)) {
        userMap.set(userId, []);
      }
      userMap.get(userId)!.push(competition);
    });

    // Get KPI point for INFORMATION code
    const informationKPI = await KPIRepository.findKPIByCode("INFORMATION");
    const informationPoint = informationKPI?.point || 0;

    // Build summary per user
    const summary = await Promise.all(
      Array.from(userMap.entries()).map(async ([userId, competitions]) => {
        const user = await userRepository.findUserById(userId);
        const userName = user?.name || "Unknown User";
        const count = competitions.length;
        const totalPoints = count * informationPoint;

        return {
          userId,
          userName,
          count,
          code: "INFORMATION",
          point: informationPoint,
          totalPoints,
        };
      }),
    );

    return summary;
  },

  getMyCompetitionPointsSummary: async (userId: string, dateFilter?: { year: number; month?: number }) => {
    // Fetch user's approved competition records
    const approvedCompetitions = await competitionRepository.findMyCompetitions(userId, dateFilter?.year, dateFilter?.month);

    // Filter by approved status
    const filteredCompetitions = approvedCompetitions.filter((competition) => competition.status === CompetitionStatus.Approved);

    // Get KPI point for INFORMATION code
    const informationKPI = await KPIRepository.findKPIByCode("INFORMATION");
    const informationPoint = informationKPI?.point || 0;

    // Calculate total
    const count = filteredCompetitions.length;
    const totalPoints = count * informationPoint;

    // Fetch user data
    const user = await userRepository.findUserById(userId);
    const userName = user?.name || "Unknown User";

    return {
      userId,
      userName,
      count,
      code: "INFORMATION",
      point: informationPoint,
      totalPoints,
    };
  },

  // Total Points Summary - All Users
  getTotalPointsSummary: async (dateFilter?: { year: number; month?: number }) => {
    // Get all KPI summaries from each module
    const [researchData, attendanceData, scheduleData, brandingData, competitionData] = await Promise.all([
      KPICountService.getResearchPointsSummary(dateFilter),
      KPICountService.getAttendancePointsSummary(dateFilter),
      KPICountService.getSchedulePointsSummary(dateFilter),
      KPICountService.getBrandingPointsSummary(dateFilter),
      KPICountService.getCompetitionPointsSummary(dateFilter),
    ]);

    // Create a map to aggregate data by userId
    const userTotalsMap = new Map<string, any>();

    // Process research data
    if (researchData.byUser) {
      researchData.byUser.forEach((user) => {
        if (!userTotalsMap.has(user.userId)) {
          userTotalsMap.set(user.userId, {
            userId: user.userId,
            userName: user.userName,
            totalPoints: 0,
          });
        }
        const userData = userTotalsMap.get(user.userId)!;
        userData.totalPoints += user.totalPoints;
        userData.research = {
          totalPoints: user.totalPoints,
          byCategory: user.byCategory,
        };
      });
    }

    // Process attendance data
    if (attendanceData.byUser) {
      attendanceData.byUser.forEach((user) => {
        if (!userTotalsMap.has(user.userId)) {
          userTotalsMap.set(user.userId, {
            userId: user.userId,
            userName: user.userName,
            totalPoints: 0,
          });
        }
        const userData = userTotalsMap.get(user.userId)!;
        userData.totalPoints += user.totalPoints;
        userData.attendance = {
          totalPoints: user.totalPoints,
          detail: user.detail,
        };
      });
    }

    // Process schedule/operational data
    if (scheduleData.byUser) {
      scheduleData.byUser.forEach((user) => {
        if (!userTotalsMap.has(user.userId)) {
          userTotalsMap.set(user.userId, {
            userId: user.userId,
            userName: user.userName,
            totalPoints: 0,
          });
        }
        const userData = userTotalsMap.get(user.userId)!;
        userData.totalPoints += user.totalPoints;
        userData.operational = {
          totalPoints: user.totalPoints,
          byScheduleType: user.byScheduleType,
        };
      });
    }

    // Process branding data
    if (Array.isArray(brandingData)) {
      brandingData.forEach((user) => {
        if (!userTotalsMap.has(user.userId)) {
          userTotalsMap.set(user.userId, {
            userId: user.userId,
            userName: user.userName,
            totalPoints: 0,
          });
        }
        const userData = userTotalsMap.get(user.userId)!;
        userData.totalPoints += user.totalPoints;
        userData.branding = {
          count: user.count,
          code: user.code,
          point: user.point,
          totalPoints: user.totalPoints,
        };
      });
    }

    // Process competition data
    if (Array.isArray(competitionData)) {
      competitionData.forEach((user) => {
        if (!userTotalsMap.has(user.userId)) {
          userTotalsMap.set(user.userId, {
            userId: user.userId,
            userName: user.userName,
            totalPoints: 0,
          });
        }
        const userData = userTotalsMap.get(user.userId)!;
        userData.totalPoints += user.totalPoints;
        userData.competition = {
          count: user.count,
          code: user.code,
          point: user.point,
          totalPoints: user.totalPoints,
        };
      });
    }

    // Convert map to sorted array by totalPoints descending
    const summary = Array.from(userTotalsMap.values()).sort((a, b) => b.totalPoints - a.totalPoints);

    return {
      totalUsers: summary.length,
      byUser: summary,
    };
  },

  // Total Points Summary - Single User
  getMyTotalPointsSummary: async (userId: string, dateFilter?: { year: number; month?: number }) => {
    // Get all KPI summaries for specific user
    const [researchData, attendanceData, scheduleData, brandingData, competitionData] = await Promise.all([
      KPICountService.getMyResearchPointsSummary(userId, dateFilter),
      KPICountService.getMyAttendancePointsSummary(userId, dateFilter),
      KPICountService.getMySchedulePointsSummary(userId, dateFilter),
      KPICountService.getMyBrandingPointsSummary(userId, dateFilter),
      KPICountService.getMyCompetitionPointsSummary(userId, dateFilter),
    ]);

    // Get user name
    const user = await userRepository.findUserById(userId);
    const userName = user?.name || "Unknown User";

    // Calculate total points
    const researchTotal = researchData.totalPoints || 0;
    const attendanceTotal = attendanceData.totalPoints || 0;
    const scheduleTotal = scheduleData.totalPoints || 0;
    const brandingTotal = brandingData.totalPoints || 0;
    const competitionTotal = competitionData.totalPoints || 0;

    const totalPoints = researchTotal + attendanceTotal + scheduleTotal + brandingTotal + competitionTotal;

    return {
      userId,
      userName,
      totalPoints,
      breakdown: {
        research: {
          totalPoints: researchTotal,
          byCategory: researchData.byCategory,
        },
        attendance: {
          totalPoints: attendanceTotal,
          detail: attendanceData.detail,
        },
        operational: {
          totalPoints: scheduleTotal,
          byScheduleType: scheduleData.byScheduleType,
        },
        branding: {
          count: brandingData.count,
          code: brandingData.code,
          point: brandingData.point,
          totalPoints: brandingTotal,
        },
        competition: {
          count: competitionData.count,
          code: competitionData.code,
          point: competitionData.point,
          totalPoints: competitionTotal,
        },
      },
    };
  },
};

export default KPICountService;
