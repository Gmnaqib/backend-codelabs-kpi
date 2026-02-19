// import { Request, Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middlewares";
// import response from "../helper/response";
// import KPIItemService from "../services/kpi.services";

// const KPIController = {
//   getOperationalSummary: async (req: AuthRequest, res: Response): Promise<any> => {
//     try {
//       const userId = req.user?.id;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getKPISummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "KPI summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getOperationalSummaryById: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { userId } = req.params;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getKPISummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "KPI summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getResearchSummary: async (req: AuthRequest, res: Response): Promise<any> => {
//     try {
//       const userId = req.user?.id;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getResearchSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Research summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getResearchSummaryById: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { userId } = req.params;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getResearchSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Research summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getAllOperationalSummary: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summaries = await KPIItemService.getAllKPISummary(Number(month), Number(year));
//       return response({ res, code: 200, message: "All KPI summaries retrieved successfully", data: summaries });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getAllResearchSummary: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summaries = await KPIItemService.getAllResearchSummary(Number(month), Number(year));
//       return response({ res, code: 200, message: "All research summaries retrieved successfully", data: summaries });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getBrandingSummary: async (req: AuthRequest, res: Response): Promise<any> => {
//     try {
//       const userId = req.user?.id;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getBrandingSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Branding summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getBrandingSummaryById: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { userId } = req.params;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getBrandingSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Branding summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getAllBrandingSummary: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summaries = await KPIItemService.getAllBrandingSummary(Number(month), Number(year));
//       return response({ res, code: 200, message: "All branding summaries retrieved successfully", data: summaries });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getCompetitionSummary: async (req: AuthRequest, res: Response): Promise<any> => {
//     try {
//       const userId = req.user?.id;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getCompetitionSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Competition summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getCompetitionSummaryById: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { userId } = req.params;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getCompetitionSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Competition summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getAllCompetitionSummary: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summaries = await KPIItemService.getAllCompetitionSummary(Number(month), Number(year));
//       return response({ res, code: 200, message: "All competition summaries retrieved successfully", data: summaries });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getTotalPointSummary: async (req: AuthRequest, res: Response): Promise<any> => {
//     try {
//       const userId = req.user?.id;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getTotalPointSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Total point summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getTotalPointSummaryById: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { userId } = req.params;
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summary = await KPIItemService.getTotalPointSummary(userId, Number(month), Number(year));
//       return response({ res, code: 200, message: "Total point summary retrieved successfully", data: summary });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   getAllTotalPointSummary: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { month, year } = req.query;

//       if (!month || !year) {
//         return response({ res, code: 400, message: "month and year are required", data: null });
//       }

//       const summaries = await KPIItemService.getAllTotalPointSummary(Number(month), Number(year));
//       return response({ res, code: 200, message: "All total point summaries retrieved successfully", data: summaries });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   researchStatistic: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { year } = req.query;

//       if (!year) {
//         return response({ res, code: 400, message: "year is required", data: null });
//       }

//       const statistics = await KPIService.getResearchStatistic(Number(year));
//       return response({ res, code: 200, message: "Research statistic retrieved successfully", data: statistics });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },

//   kpiStatistic: async (req: Request, res: Response): Promise<any> => {
//     try {
//       const { year } = req.query;

//       if (!year) {
//         return response({ res, code: 400, message: "year is required", data: null });
//       }

//       const statistics = await KPIService.getKpiStatistic(Number(year));
//       return response({ res, code: 200, message: "KPI statistic retrieved successfully", data: statistics });
//     } catch (error: any) {
//       return response({ res, code: 500, message: error.message, data: null });
//     }
//   },
// };

// export default KPIController;
