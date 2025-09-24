interface ISchedule {
  type: ScheduleType;
  date?: Date;
  days?: IScheduleDays;
  description?: string;
}

export interface IScheduleDays {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
  sunday?: string[];
}

export enum ScheduleType {
  picket = "picket",
  thematic = "thematic",
}
export default ISchedule;
