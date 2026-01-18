import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
const productRouter = Router();

productRouter.post("/", authenticateToken, ProductController.addProduct);
productRouter.get("/", authenticateToken, ProductController.findAllProducts);
productRouter.get("/:id", authenticateToken, ProductController.findProductById);
productRouter.patch("/:id", authenticateToken, ProductController.updateProduct);
productRouter.delete("/:id", authenticateToken, ProductController.deleteProduct);

export default productRouter;
