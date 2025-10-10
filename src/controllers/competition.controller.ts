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
      const Competitions = await CompetitionService.findAllCompetitions();
      return response({ res, code: 201, message: "get all Competitions success", data: Competitions });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findCompetitionById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const Competition = await CompetitionService.findCompetitionById(id);
      return response({ res, code: 201, message: "get Competitions by id success", data: Competition });
    } catch (error: any) {
      return response({ res, code: error.message === "Competition not found" ? 404 : 500, message: error.message, data: null });
    }
  },

  updateCompetition: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, description, deadline, link, status, type } = req.body;

      const Competition = await CompetitionService.updateCompetition(id, { name, description, deadline, link, status, type });
      return response({ res, code: 201, message: "update Competitions success", data: Competition });
    } catch (error: any) {
      return response({ res, code: error.message === "Competition not found" ? 400 : 500, message: error.message, data: null });
    }
  },

  deleteCompetition: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const deletedCompetition = await CompetitionService.deleteCompetition(id);
      return response({ res, code: 201, message: "delete Competition success", data: deletedCompetition });
    } catch (error: any) {
      return response({ res, code: error.message === "Competition not found" ? 400 : 500, message: error.message, data: null });
    }
  },
};

export default competitionController;
