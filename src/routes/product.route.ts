import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const productRouter = Router();

productRouter.post("/", authenticateToken, roleMiddlewares(["admin", "minister of research"]), ProductController.addProduct);
productRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of research"]), ProductController.findAllProducts);
productRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research"]), ProductController.findProductById);
productRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research"]), ProductController.updateProduct);
productRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research"]), ProductController.deleteProduct);
export default productRouter;
