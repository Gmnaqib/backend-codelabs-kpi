import competitionRepository from "../repository/competition.respository";
import ICompetition, { CompetitionType, CompetitionStatus } from "../models/competition/competition.interface";
import { Types } from "mongoose";

const CompetitionService = {
  addCompetition: async (userId: string, name: string, description: string, deadline: string, link: string, type: CompetitionType): Promise<ICompetition> => {
    const userObjectId = new Types.ObjectId(userId);
    return await competitionRepository.createCompetition({
      userId: userObjectId,
      name,
      description,
      deadline: new Date(deadline),
      link,
      type,
    });
  },

  findAllCompetitions: async (): Promise<ICompetition[]> => {
    return await competitionRepository.findAllCompetitions();
  },

  findCompetitionById: async (id: string): Promise<ICompetition> => {
    const Competition = await competitionRepository.findCompetitionById(id);
    if (!Competition) {
      throw new Error("Competition not found");
    }
    return Competition;
  },

  updateCompetition: async (
    id: string,
    updateData: { userId?: string; name?: string; description?: string; deadline?: string; link?: string; status?: CompetitionStatus; type?: CompetitionType }
  ): Promise<ICompetition> => {
    const { name, description, deadline, link, status, type } = updateData;
    const Competition = await competitionRepository.findCompetitionById(id);

    if (!Competition) {
      throw new Error("Competition not found");
    }

    Competition.name = name || Competition.name;
    Competition.description = description || Competition.description;
    Competition.deadline = deadline ? new Date(deadline) : Competition.deadline;

    Competition.link = link || Competition.link;
    Competition.status = status || Competition.status;
    Competition.type = type || Competition.type;

    await Competition.save();
    return Competition;
  },

  deleteCompetition: async (id: string): Promise<ICompetition | null> => {
    const Competition = await competitionRepository.findCompetitionById(id);

    if (!Competition) {
      throw new Error("Competition not found");
    }

    const deletedCompetition = await competitionRepository.deleteCompetitionById(id);
    return deletedCompetition;
  },
};

export default CompetitionService;
