import ProductRepository from "../repository/product.respository";
import IProduct, { productStatus } from "../models/product/product.interface";
import { Types } from "mongoose";

const productServices = {
  addProduct: async (name: string, description: string, status?: productStatus): Promise<IProduct> => {
    return await ProductRepository.createProduct({
      name,
      description,
      status,
    });
  },

  findAllProducts: async (): Promise<IProduct[]> => {
    return await ProductRepository.findAllProducts();
  },
  findProductsByFilter: async (filter: any): Promise<IProduct[]> => {
    const formattedFilter = { ...filter };
    if (filter.productManager) formattedFilter.productManager = new Types.ObjectId(filter.productManager);
    return ProductRepository.findProductByFilter(formattedFilter);
  },

  findProductById: async (id: string): Promise<IProduct> => {
    const product = await ProductRepository.findProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },

  updateProduct: async (id: string, updateData: { productManager?: Types.ObjectId; name?: string; description?: string; status?: productStatus }): Promise<IProduct> => {
    const { productManager, name, description, status } = updateData;
    const product = await ProductRepository.findProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.productManager = productManager || product.productManager;
    product.name = name || product.name;
    product.description = description || product.description;
    product.status = status || product.status;
    await product.save();
    return product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const product = await ProductRepository.findProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await ProductRepository.deleteProduct(id);
  },
};

export default productServices;
