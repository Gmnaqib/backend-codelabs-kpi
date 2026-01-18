import Product from "../models/product/product.schema";
import IProduct, { productStatus } from "../models/product/product.interface";
import { Types } from "mongoose";

interface productFilter {
  _id?: Types.ObjectId;
  productManager?: Types.ObjectId;
  status?: productStatus;
}

const ProductRepository = {
  createProduct: (productData: Partial<IProduct>) => Product.create(productData),
  updateProduct: (id: string, productData: Partial<IProduct>) => Product.updateOne({ _id: new Types.ObjectId(id) }, productData),
  findAllProducts: () => Product.find(),
  findProductByFilter: (filter: productFilter) => Product.find(filter),
  findProductById: (id: string) => Product.findById(new Types.ObjectId(id)),
  deleteProduct: (id: string) => Product.deleteOne({ _id: new Types.ObjectId(id) }),
};

export default ProductRepository;
