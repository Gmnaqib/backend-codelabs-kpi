import Research from "../models/research/research.schema";
import IResearch, { CategoryType, progressStatus, statusResearch } from "../models/research/research.interface";
import { Types } from "mongoose";

interface ResearchFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  week?: number;
  category?: CategoryType;
  title?: string;
  progress?: progressStatus;
  status?: statusResearch;
  createdAt?: { $gte?: Date; $lte?: Date };
  updatedAt?: { $gte?: Date; $lte?: Date };
}

const researchRepository = {
  createResearch: (researchData: Partial<IResearch>) => Research.create(researchData),
  findAllResearch: () => Research.find().populate("userId", "name").sort({ createdAt: -1 }),
  findResearchById: (id: string) => Research.findById(id).populate("userId", "name"),
  findResearchByIdWithoutPopulate: (id: string) => Research.findById(id),
  findResearchByFilter: (filter: ResearchFilter) => Research.find(filter).populate("userId", "name").sort({ createdAt: -1 }),
  findResearchByUserId: (userId: string) => Research.find({ userId }).populate("userId", "name").sort({ createdAt: -1 }),
  findMyResearch: (userId: string) => Research.find({ userId }).sort({ createdAt: -1 }),
  findResearchByWeek: (week: number) => Research.find({ week }).populate("userId", "name").sort({ createdAt: -1 }),
  findResearchByCategory: (category: CategoryType) => Research.find({ category }).populate("userId", "name").sort({ createdAt: -1 }),
  findResearchByProgress: (progress: progressStatus) => Research.find({ progress }).populate("userId", "name").sort({ createdAt: -1 }),
  findResearchByStatus: (status: statusResearch) => Research.find({ status }).populate("userId", "name").sort({ createdAt: -1 }),
  findResearchWithFilters: (filters: { userId?: string; week?: number; category?: CategoryType; progress?: progressStatus; status?: statusResearch; date?: { year: number; month?: number } }) => {
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.week) query.week = filters.week;
    if (filters.category) query.category = filters.category;
    if (filters.progress) query.progress = filters.progress;
    if (filters.status) query.status = filters.status;
    if (filters.date) {
      if (filters.date.month) {
        // Filter by month and year
        const startDate = new Date(filters.date.year, filters.date.month - 1, 1);
        const endDate = new Date(filters.date.year, filters.date.month, 0, 23, 59, 59, 999);
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      } else {
        // Filter by year only
        const startDate = new Date(filters.date.year, 0, 1);
        const endDate = new Date(filters.date.year, 11, 31, 23, 59, 59, 999);
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
    }

    return Research.find(query).populate("userId", "name").sort({ createdAt: -1 });
  },

  findDuplicateResearch: (userId: string, week: number, title: string) => {
    return Research.findOne({
      userId,
      week,
      title: { $regex: `^${title}$`, $options: "i" },
    });
  },

  updateResearchById: (id: string, updateData: Partial<IResearch>) => Research.findByIdAndUpdate(id, updateData, { new: true }).populate("userId", "name"),
  updateResearch: (filter: ResearchFilter, updateData: Partial<IResearch>) => Research.updateOne(filter, updateData),
  deleteResearchById: (id: string) => Research.findByIdAndDelete(id).populate("userId", "name"),
  deleteResearch: (filter: ResearchFilter) => Research.deleteOne(filter),
  countResearch: () => Research.countDocuments(),
  countResearchByFilter: (filter: ResearchFilter) => Research.countDocuments(filter),

  countResearchWithFilters: (filters: { userId?: string; week?: number; category?: CategoryType; progress?: progressStatus; status?: statusResearch; date?: { year: number; month?: number } }) => {
    const query: any = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.week) query.week = filters.week;
    if (filters.category) query.category = filters.category;
    if (filters.progress) query.progress = filters.progress;
    if (filters.status) query.status = filters.status;
    if (filters.date) {
      if (filters.date.month) {
        // Filter by month and year
        const startDate = new Date(filters.date.year, filters.date.month - 1, 1);
        const endDate = new Date(filters.date.year, filters.date.month, 0, 23, 59, 59, 999);
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      } else {
        // Filter by year only
        const startDate = new Date(filters.date.year, 0, 1);
        const endDate = new Date(filters.date.year, 11, 31, 23, 59, 59, 999);
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
    }

    return Research.countDocuments(query);
  },

  researchExists: (userId: string, week: number, title: string) => {
    return Research.exists({
      userId,
      week,
      title: { $regex: `^${title}$`, $options: "i" },
    });
  },

  getResearchStats: async () => {
    const stats = await Research.aggregate([
      {
        $group: {
          _id: null,
          totalResearch: { $sum: 1 },
          finishedResearch: { $sum: { $cond: [{ $eq: ["$progress", "finished"] }, 1, 0] } },
          unfinishedResearch: { $sum: { $cond: [{ $eq: ["$progress", "unfinished"] }, 1, 0] } },
          approvedResearch: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          pendingResearch: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          rejectedResearch: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        },
      },
    ]);
    return (
      stats[0] || {
        totalResearch: 0,
        finishedResearch: 0,
        unfinishedResearch: 0,
        approvedResearch: 0,
        pendingResearch: 0,
        rejectedResearch: 0,
      }
    );
  },

  getUserResearchStats: async (userId: string) => {
    const stats = await Research.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalResearch: { $sum: 1 },
          finishedResearch: { $sum: { $cond: [{ $eq: ["$progress", "finished"] }, 1, 0] } },
          unfinishedResearch: { $sum: { $cond: [{ $eq: ["$progress", "unfinished"] }, 1, 0] } },
          approvedResearch: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          pendingResearch: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          rejectedResearch: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        },
      },
    ]);
    return (
      stats[0] || {
        totalResearch: 0,
        finishedResearch: 0,
        unfinishedResearch: 0,
        approvedResearch: 0,
        pendingResearch: 0,
        rejectedResearch: 0,
      }
    );
  },
};

export default researchRepository;
