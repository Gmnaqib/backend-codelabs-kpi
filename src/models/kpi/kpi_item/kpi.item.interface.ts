export interface IKPIItem {
  category: KPICategory;
  code: string;
  point: number;
}

export enum KPICategory {
  RESEARCH = "RESEARCH",
  COMPETITION = "COMPETITION",
  OPERATIONAL = "OPERATIONAL",
  BRANDING = "BRANDING",
}

export default IKPIItem;
