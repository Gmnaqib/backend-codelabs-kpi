import Competition from "../models/competition/competition.schema";
import ICompetition, { CompetitionStatus, CompetitionType } from "../models/competition/competition.interface";
import { Types } from "mongoose";

interface CompetitionFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  name?: string;
  description?: string;
  deadline?: Date;
  link?: string;
  status?: CompetitionStatus;
  type?: CompetitionType;
}

const competitionRepository = {
  createCompetition: (competitionData: Partial<ICompetition>) => Competition.create(competitionData),
  findAllCompetitions: () => Competition.find(),
  findMyCompetitions: (userId: string, year?: number, month?: number) => {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (year !== undefined && month !== undefined) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (year !== undefined) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return Competition.find(query);
  },
  findCompetitionById: (id: string) => Competition.findById(id),
  findCompetition: (filter: CompetitionFilter) => Competition.findOne(filter),
  findCompetitionsByFilter: (filter: CompetitionFilter, date?: { year: number; month: number }) => {
    const query: any = { ...filter };

    if (date) {
      const startDate = new Date(date.year, date.month - 1, 1);
      const endDate = new Date(date.year, date.month, 0, 23, 59, 59, 999);
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return Competition.find(query);
  },
  updateCompetitionById: (id: string, updateData: Partial<ICompetition>) => Competition.findByIdAndUpdate(id, updateData, { new: true }),
  updateCompetition: (filter: CompetitionFilter, updateData: Partial<ICompetition>) => Competition.updateOne(filter, updateData),
  deleteCompetitionById: (id: string) => Competition.findByIdAndDelete(id),
  deleteCompetition: (filter: CompetitionFilter) => Competition.deleteOne(filter),
};

export default competitionRepository;
