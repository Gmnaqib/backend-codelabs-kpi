import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import response from "../helper/response";
import CompetitionService from "../services/competition.service";

const competitionController = {
  addCompetition: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { name, description, deadline, link, type } = req.body;
      const newCompetition = await CompetitionService.addCompetition(userId, name, description, deadline, link, type);
      return response({ res, code: 201, message: "Competition success created", data: newCompetition });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findAllCompetition: async (req: Request, res: Response): Promise<any> => {
    try {
      const filters = req.query;
      const Competitions = await CompetitionService.findAllCompetitions(filters);
      return response({ res, code: 200, message: "get all Competitions success", data: Competitions });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  getMyCompetitions: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      const { year, month } = req.query;

      if (!userId) {
        return response({ res, code: 401, message: "Authentication required", data: null });
      }

      const yearNum = year ? Number(year) : undefined;
      const monthNum = month ? Number(month) : undefined;
      const competitions = await CompetitionService.getMyCompetitions(userId, yearNum, monthNum);
      return response({ res, code: 200, message: "Get my competitions success", data: competitions });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateMyCompetitions: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, description, deadline, link, type } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return response({ res, code: 401, message: "Authentication required", data: null });
      }

      const updatedCompetition = await CompetitionService.updateMyCompetition(id as string, userId, { name, description, deadline, link, type });
      return response({ res, code: 200, message: "Update my competition success", data: updatedCompetition });
    } catch (error: any) {
      if (error.message === "Competition not found") {
        return response({ res, code: 404, message: error.message, data: null });
      } else if (error.message === "You can only update your own competitions") {
        return response({ res, code: 403, message: error.message, data: null });
      }
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findCompetitionById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const Competition = await CompetitionService.findCompetitionById(id as string);
      return response({ res, code: 201, message: "get Competitions by id success", data: Competition });
    } catch (error: any) {
      return response({ res, code: error.message === "Competition not found" ? 404 : 500, message: error.message, data: null });
    }
  },

  updateCompetition: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, description, deadline, link, status, type } = req.body;

      const Competition = await CompetitionService.updateCompetition(id as string, { name, description, deadline, link, status, type });
      return response({ res, code: 201, message: "update Competitions success", data: Competition });
    } catch (error: any) {
      return response({ res, code: error.message === "Competition not found" ? 400 : 500, message: error.message, data: null });
    }
  },

  deleteCompetition: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const deletedCompetition = await CompetitionService.deleteCompetition(id as string);
      return response({ res, code: 201, message: "delete Competition success", data: deletedCompetition });
    } catch (error: any) {
      return response({ res, code: error.message === "Competition not found" ? 400 : 500, message: error.message, data: null });
    }
  },
};

export default competitionController;
