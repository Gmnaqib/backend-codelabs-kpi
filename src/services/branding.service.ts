import brandingRepository from "../repository/branding.respository";
import IBranding, { brandingStatus, researchCategory, brandingLevel } from "../models/branding/branding.interface";
import { Types } from "mongoose";

const BrandingService = {
  addBranding: async (userId: string, name: string, description: string, link: string, status: brandingStatus, research: researchCategory, level: brandingLevel): Promise<IBranding> => {
    const userObjectId = new Types.ObjectId(userId);
    return await brandingRepository.createBranding({
      userId: userObjectId,
      name,
      description,
      link,
      status,
      research,
      level,
    });
  },

  findAllBrandings: async (): Promise<IBranding[]> => {
    return await brandingRepository.findAllBrandings();
  },

  findBrandingsByFilter: async (filter: any): Promise<IBranding[]> => {
    const formattedFilter = { ...filter };

    if (filter.userId) formattedFilter.userId = new Types.ObjectId(filter.userId);

    let dateFilter: { year: number; month: number } | undefined;
    if (filter.date) {
      const parsedDate = new Date(filter.date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth() + 1;
      dateFilter = { year, month };
    }

    const { date, ...queryFilter } = formattedFilter;

    return brandingRepository.findBrandingsByFilter(queryFilter, dateFilter);
  },

  findBrandingById: async (id: string): Promise<IBranding> => {
    const Branding = await brandingRepository.findBrandingById(id);
    if (!Branding) {
      throw new Error("Branding not found");
    }
    return Branding;
  },

  updateBranding: async (
    id: string,
    updateData: { userId?: string; name?: string; description?: string; link?: string; status?: brandingStatus; research?: researchCategory; level?: brandingLevel }
  ): Promise<IBranding> => {
    const { name, description, link, status, research, level } = updateData;
    const Branding = await brandingRepository.findBrandingById(id);

    if (!Branding) {
      throw new Error("Branding not found");
    }

    Branding.name = name || Branding.name;
    Branding.description = description || Branding.description;
    Branding.link = link || Branding.link;
    Branding.status = status || Branding.status;
    Branding.research = research || Branding.research;
    Branding.level = level || Branding.level;

    await Branding.save();
    return Branding;
  },

  deleteBranding: async (id: string): Promise<IBranding | null> => {
    const Branding = await brandingRepository.findBrandingById(id);

    if (!Branding) {
      throw new Error("Branding not found");
    }

    await brandingRepository.deleteBrandingById(id);
    return Branding;
  },
};

export default BrandingService;
