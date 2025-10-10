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
  findCompetitionById: (id: string) => Competition.findById(id),
  findCompetition: (filter: CompetitionFilter) => Competition.findOne(filter),
  findCompetitionsByFilter: (filter: CompetitionFilter) => Competition.find(filter),
  updateCompetitionById: (id: string, updateData: Partial<ICompetition>) => Competition.findByIdAndUpdate(id, updateData, { new: true }),
  updateCompetition: (filter: CompetitionFilter, updateData: Partial<ICompetition>) => Competition.updateOne(filter, updateData),
  deleteCompetitionById: (id: string) => Competition.findByIdAndDelete(id),
  deleteCompetition: (filter: CompetitionFilter) => Competition.deleteOne(filter),
};

export default competitionRepository;
