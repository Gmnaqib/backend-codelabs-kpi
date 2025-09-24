import IResearch, { CategoryType, progressStatus, statusResearch } from "../models/research/research.interface";
import researchRepository from "../repository/research.repository";
import userRepository from "../repository/user.repository";

/**
 * Service layer for research
 * Handles business logic, validation, and duplicate prevention
 */
const researchService = {
  /**
   * Create a new research record with duplicate check
   */
  createResearch: async (researchData: IResearch): Promise<IResearch> => {
    // Validate required fields
    if (!researchData.userId || !researchData.week || !researchData.title) {
      throw new Error("Missing required fields: userId, week, and title are required");
    }

    // Validate week number (should be positive)
    if (researchData.week <= 0) {
      throw new Error("Week number must be a positive integer");
    }

    // Validate URL format for link
    try {
      new URL(researchData.link);
    } catch (error) {
      throw new Error("Invalid URL format for link field");
    }

    // Check for duplicate research (same userId, week, and title)
    const existingResearch = await researchRepository.findDuplicateResearch(researchData.userId.toString(), researchData.week, researchData.title);

    if (existingResearch) {
      throw new Error(`Research already exists for user on week ${researchData.week} with title "${researchData.title}"`);
    }

    // Set default status if not provided
    if (!researchData.status) {
      researchData.status = statusResearch.pending;
    }

    const newResearch = await researchRepository.createResearch(researchData);
    return newResearch;
  },

  /**
   * Get all research records with optional filtering
   */
  getAllResearch: async (filters?: { userId?: string; week?: number; category?: CategoryType; progress?: progressStatus; status?: statusResearch; research_type?: string }): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchWithFilters(filters || {});
    return research;
  },

  /**
   * Get research record by ID
   */
  getResearchById: async (researchId: string): Promise<IResearch | null> => {
    const research = await researchRepository.findResearchById(researchId);
    return research;
  },

  /**
   * Get research records by user ID (for authenticated user's own research)
   */
  getResearchByUserId: async (userId: string): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchByUserId(userId);
    return research;
  },

  /**
   * Get research records by week
   */
  getResearchByWeek: async (week: number): Promise<IResearch[]> => {
    if (week <= 0) {
      throw new Error("Week number must be a positive integer");
    }
    const research = await researchRepository.findResearchByWeek(week);
    return research;
  },

  /**
   * Get research records by category
   */
  getResearchByCategory: async (category: CategoryType): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchByCategory(category);
    return research;
  },

  /**
   * Get research records by progress status
   */
  getResearchByProgress: async (progress: progressStatus): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchByProgress(progress);
    return research;
  },

  /**
   * Get research records by status
   */
  getResearchByStatus: async (status: statusResearch): Promise<IResearch[]> => {
    const research = await researchRepository.findResearchByStatus(status);
    return research;
  },

  /**
   * Update research record by ID with validation and duplicate check
   */
  updateResearch: async (researchId: string, updateData: Partial<IResearch>): Promise<IResearch | null> => {
    const existingResearch = await researchRepository.findResearchById(researchId);
    if (!existingResearch) {
      throw new Error("Research record not found");
    }

    // Validate week number if being updated
    if (updateData.week && updateData.week <= 0) {
      throw new Error("Week number must be a positive integer");
    }

    // Validate URL format if link is being updated
    if (updateData.link) {
      try {
        new URL(updateData.link);
      } catch (error) {
        throw new Error("Invalid URL format for link field");
      }
    }

    // Check for duplicates if key fields are being updated
    if (updateData.userId || updateData.week || updateData.title) {
      const userId = updateData.userId || existingResearch.userId;
      const week = updateData.week || existingResearch.week;
      const title = updateData.title || existingResearch.title;

      // Only check for duplicates if the combination is actually changing
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
    return updatedResearch;
  },

  /**
   * Delete research record by ID
   */
  deleteResearch: async (researchId: string): Promise<IResearch | null> => {
    const research = await researchRepository.deleteResearchById(researchId);
    return research;
  },

  /**
   * Get research count with optional filtering
   */
  getResearchCount: async (filters?: { userId?: string; week?: number; category?: CategoryType; progress?: progressStatus; status?: statusResearch; research_type?: string }): Promise<number> => {
    return researchRepository.countResearchWithFilters(filters || {});
  },

  /**
   * Check if research exists for user on specific week with title
   */
  checkResearchExists: async (userId: string, week: number, title: string): Promise<boolean> => {
    const exists = await researchRepository.researchExists(userId, week, title);
    return !!exists;
  },

  /**
   * Get overall research statistics
   */
  getResearchStatistics: async () => {
    return researchRepository.getResearchStats();
  },

  /**
   * Get research statistics for a specific user
   */
  getUserResearchStatistics: async (userId: string) => {
    return researchRepository.getUserResearchStats(userId);
  },

  /**
   * Approve research (change status to approved)
   */
  approveResearch: async (researchId: string): Promise<IResearch | null> => {
    return researchService.updateResearch(researchId, { status: statusResearch.approved });
  },

  /**
   * Reject research (change status to rejected)
   */
  rejectResearch: async (researchId: string): Promise<IResearch | null> => {
    return researchService.updateResearch(researchId, { status: statusResearch.rejected });
  },

  /**
   * Mark research as pending (change status to pending)
   */
  markResearchPending: async (researchId: string): Promise<IResearch | null> => {
    return researchService.updateResearch(researchId, { status: statusResearch.pending });
  },

  /**
   * Complete research (change progress to finished)
   */
  completeResearch: async (researchId: string): Promise<IResearch | null> => {
    return researchService.updateResearch(researchId, { progress: progressStatus.Finished });
  },

  /**
   * Mark research as unfinished (change progress to unfinished)
   */
  markResearchUnfinished: async (researchId: string): Promise<IResearch | null> => {
    return researchService.updateResearch(researchId, { progress: progressStatus.Unfinished });
  },
};

export default researchService;
