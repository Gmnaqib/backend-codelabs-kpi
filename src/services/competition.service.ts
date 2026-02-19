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

  findAllCompetitions: async (filters?: any): Promise<ICompetition[]> => {
    if (!filters || Object.keys(filters).length === 0) {
      return await competitionRepository.findAllCompetitions();
    }

    const formattedFilter: any = { ...filters };

    if (filters.userId) {
      formattedFilter.userId = new Types.ObjectId(filters.userId);
    }

    // Handle date parsing and validation
    let dateFilter: { year: number; month: number } | undefined;
    if (filters.date) {
      const parsedDate = new Date(filters.date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth() + 1;
      dateFilter = { year, month };
    }

    const { date, ...queryFilter } = formattedFilter;

    return await competitionRepository.findCompetitionsByFilter(queryFilter, dateFilter);
  },

  getMyCompetitions: async (userId: string, year?: number, month?: number): Promise<ICompetition[]> => {
    return await competitionRepository.findMyCompetitions(userId, year, month);
  },

  updateMyCompetition: async (id: string, userId: string, updateData: { name?: string; description?: string; deadline?: string; link?: string; type?: CompetitionType }): Promise<any> => {
    const competition = await competitionRepository.findCompetitionById(id);

    if (!competition) {
      throw new Error("Competition not found");
    }

    if (competition.userId.toString() !== userId) {
      throw new Error("You can only update your own competitions");
    }

    const { name, description, deadline, link, type } = updateData;

    if (name !== undefined) {
      competition.name = name;
    }
    if (description !== undefined) {
      competition.description = description;
    }
    if (deadline !== undefined) {
      competition.deadline = new Date(deadline);
    }
    if (link !== undefined) {
      competition.link = link;
    }
    if (type !== undefined) {
      competition.type = type;
    }

    await competition.save();

    const { _id, userId: uid, ...responseData } = competition.toObject();
    return responseData;
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
    updateData: { userId?: string; name?: string; description?: string; deadline?: string; link?: string; status?: CompetitionStatus; type?: CompetitionType },
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
