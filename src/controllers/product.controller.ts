import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import response from "../helper/response";
import productServices from "../services/product.service";

const ProductController = {
  addProduct: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { name, description } = req.body;
      const newProduct = await productServices.addProduct(name, description);
      return response({ res, code: 201, message: "Product successfully created", data: newProduct });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  findAllProducts: async (req: Request, res: Response): Promise<any> => {
    try {
      const filter = req.query;
      if (!filter) {
        const products = await productServices.findAllProducts();
        return response({ res, code: 201, message: "Get all products success", data: products });
      }
      const products = await productServices.findProductsByFilter(filter);
      return response({ res, code: 200, message: "Get products by filter success", data: products });
    } catch (error: any) {
      return response({ res, code: 500, message: error.message, data: null });
    }
  },

  updateProduct: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { productManager, name, description, status } = req.body;
      const product = await productServices.updateProduct(id as string, { productManager, name, description, status });
      return response({ res, code: 201, message: "Update product success", data: product });
    } catch (error: any) {
      return response({ res, code: error.message === "Product not found" ? 400 : 500, message: error.message, data: null });
    }
  },

  findProductById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const product = await productServices.findProductById(id as string);
      return response({ res, code: 201, message: "Get product by id success", data: product });
    } catch (error: any) {
      return response({ res, code: error.message === "Product not found" ? 400 : 500, message: error.message, data: null });
    }
  },

  deleteProduct: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      await productServices.deleteProduct(id as string);
      return response({ res, code: 201, message: "Delete product success", data: null });
    } catch (error: any) {
      return response({ res, code: error.message === "Product not found" ? 400 : 500, message: error.message, data: null });
    }
  },
};

export default ProductController;
