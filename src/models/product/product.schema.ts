import mongoose, { Schema, model } from "mongoose";
import IProduct, { productStatus } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    productManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [productStatus.ACTIVE, productStatus.INACTIVE],
      default: productStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
