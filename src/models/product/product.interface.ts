import { Types } from "mongoose";

interface IProduct {
  productManager: Types.ObjectId;
  name: string;
  description: string;
  status: productStatus;
}

export enum productStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export default IProduct;
