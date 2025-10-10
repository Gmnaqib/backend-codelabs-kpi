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
  findBrandingById: (id: string) => Branding.findById(id),
  findBranding: (filter: BrandingFilter) => Branding.findOne(filter),
  findBrandingsByFilter: (filter: BrandingFilter) => Branding.find(filter),
  updateBrandingById: (id: string, updateData: Partial<IBranding>) => Branding.findByIdAndUpdate(id, updateData, { new: true }),
  updateBranding: (filter: BrandingFilter, updateData: Partial<IBranding>) => Branding.updateOne(filter, updateData),
  deleteBrandingById: (id: string) => Branding.findByIdAndDelete(id),
  deleteBranding: (filter: BrandingFilter) => Branding.deleteOne(filter),
};

export default brandingRepository;
