import IResearch, { CategoryType, progressStatus, statusResearch } from "../models/research/research.interface";
import researchRepository from "../repository/research.repository";

const researchService = {
  createResearch: async (researchData: IResearch): Promise<IResearch> => {
    if (!researchData.userId || !researchData.week || !researchData.title) {
      throw new Error("Missing required fields: userId, week, and title are required");
    }

    if (researchData.week <= 0) {
      throw new Error("Week number must be a positive integer");
    }

    try {
      new URL(researchData.link);
    } catch (error) {
      throw new Error("Invalid URL format for link field");
    }

    const existingResearch = await researchRepository.findDuplicateResearch(researchData.userId.toString(), researchData.week, researchData.title);

    if (existingResearch) {
      throw new Error(`Research already exists for user on week ${researchData.week} with title "${researchData.title}"`);
    }

    if (!researchData.status) {
      researchData.status = statusResearch.pending;
    }

    const newResearch = await researchRepository.createResearch(researchData);
    return newResearch;
  },

  getAllResearch: async (filters?: {
    userId?: string;
    week?: number;
    category?: CategoryType;
    progress?: progressStatus;
    status?: statusResearch;
    research_type?: string;
    date?: { year: number; month?: number };
  }): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchWithFilters(filters || {});
    return research;
  },

  getResearchById: async (researchId: string): Promise<IResearch | null> => {
    const research = await researchRepository.findResearchById(researchId);
    return research;
  },

  getResearchByIdWithoutPopulate: async (id: string): Promise<IResearch | null> => {
    return await researchRepository.findResearchByIdWithoutPopulate(id);
  },

  getResearchByUserId: async (userId: string): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchByUserId(userId);
    return research;
  },

  getMyResearch: async (userId: string): Promise<IResearch[]> => {
    const research = await researchRepository.findMyResearch(userId);
    return research;
  },

  updateResearch: async (researchId: string, updateData: Partial<IResearch>): Promise<any> => {
    const existingResearch = await researchRepository.findResearchById(researchId);
    if (!existingResearch) {
      throw new Error("Research record not found");
    }

    if (updateData.week && updateData.week <= 0) {
      throw new Error("Week number must be a positive integer");
    }

    if (updateData.link) {
      try {
        new URL(updateData.link);
      } catch (error) {
        throw new Error("Invalid URL format for link field");
      }
    }

    if (updateData.userId || updateData.week || updateData.title) {
      const userId = updateData.userId || existingResearch.userId;
      const week = updateData.week || existingResearch.week;
      const title = updateData.title || existingResearch.title;

      const isChangingKey =
        (updateData.userId && updateData.userId.toString() !== existingResearch.userId.toString()) ||
        (updateData.week && updateData.week !== existingResearch.week) ||
        (updateData.title && updateData.title.toLowerCase() !== existingResearch.title.toLowerCase());

      if (isChangingKey) {
        const duplicateResearch = await researchRepository.findDuplicateResearch(userId.toString(), week, title);
        if (duplicateResearch && duplicateResearch._id.toString() !== researchId) {
          throw new Error(`Research already exists for user on week ${week} with title "${title}"`);
        }
      }
    }

    const updatedResearch = await researchRepository.updateResearchById(researchId, updateData);

    if (!updatedResearch) {
      return null;
    }

    const { _id, userId, ...responseData } = updatedResearch.toObject();
    return responseData;
  },

  updateMyResearch: async (researchId: string, updateData: Partial<IResearch>): Promise<any> => {
    const existingResearch = await researchRepository.findResearchByIdWithoutPopulate(researchId);
    if (!existingResearch) {
      throw new Error("Research record not found");
    }

    if (updateData.week && updateData.week <= 0) {
      throw new Error("Week number must be a positive integer");
    }

    if (updateData.link) {
      try {
        new URL(updateData.link);
      } catch (error) {
        throw new Error("Invalid URL format for link field");
      }
    }

    if (updateData.week || updateData.title) {
      const userId = existingResearch.userId;
      const week = updateData.week || existingResearch.week;
      const title = updateData.title || existingResearch.title;

      const isChangingKey = (updateData.week && updateData.week !== existingResearch.week) || (updateData.title && updateData.title.toLowerCase() !== existingResearch.title.toLowerCase());

      if (isChangingKey) {
        const duplicateResearch = await researchRepository.findDuplicateResearch(userId.toString(), week, title);
        if (duplicateResearch && duplicateResearch._id.toString() !== researchId) {
          throw new Error(`Research already exists for user on week ${week} with title "${title}"`);
        }
      }
    }

    const updatedResearch = await researchRepository.updateResearchById(researchId, updateData);

    if (!updatedResearch) {
      return null;
    }

    const { _id, userId, ...responseData } = updatedResearch.toObject();
    return responseData;
  },

  deleteResearch: async (researchId: string): Promise<IResearch | null> => {
    const research = await researchRepository.deleteResearchById(researchId);
    return research;
  },

  checkResearchExists: async (userId: string, week: number, title: string): Promise<boolean> => {
    const exists = await researchRepository.researchExists(userId, week, title);
    return !!exists;
  },
};

export default researchService;
