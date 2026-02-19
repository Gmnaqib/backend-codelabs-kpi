import Branding from "../models/branding/branding.schema";
import IBranding, { brandingStatus, researchCategory, brandingLevel } from "../models/branding/branding.interface";
import { Types } from "mongoose";

interface BrandingFilter {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  name?: string;
  description?: string;
  link?: string;
  status?: brandingStatus;
  type?: researchCategory;
  level?: brandingLevel;
}

const brandingRepository = {
  createBranding: (brandingData: Partial<IBranding>) => Branding.create(brandingData),
  findAllBrandings: () => Branding.find(),
  findMyBrandings: (userId: string, year?: number, month?: number) => {
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

    return Branding.find(query);
  },
  findBrandingById: (id: string) => Branding.findById(id),
  findBranding: (filter: BrandingFilter) => Branding.findOne(filter),
  findBrandingsByFilter: (filter: BrandingFilter, date?: { year: number; month: number }) => {
    const query: any = { ...filter };

    if (date) {
      const startDate = new Date(date.year, date.month - 1, 1);
      const endDate = new Date(date.year, date.month, 0, 23, 59, 59, 999);
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return Branding.find(query);
  },
  updateBrandingById: (id: string, updateData: Partial<IBranding>) => Branding.findByIdAndUpdate(id, updateData, { new: true }),
  updateBranding: (filter: BrandingFilter, updateData: Partial<IBranding>) => Branding.updateOne(filter, updateData),
  deleteBrandingById: (id: string) => Branding.findByIdAndDelete(id),
  deleteBranding: (filter: BrandingFilter) => Branding.deleteOne(filter),
};

export default brandingRepository;
