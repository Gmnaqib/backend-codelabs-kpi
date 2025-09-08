import LeaveRequest from "../models/attendance/leave.request.schema";
import IleaveRequest from "../models/attendance/leave.request.interface";

const leaveRequestRepository = {
  create: (leaveRequestData: IleaveRequest) => LeaveRequest.create(leaveRequestData),
  updateOne: (leaveRequestData: any) => LeaveRequest.updateOne(leaveRequestData),
  findLeaveRequest: (filter: any) => LeaveRequest.findOne(filter),
  findById: (id: string) => LeaveRequest.findById(id),
};

export default leaveRequestRepository;
