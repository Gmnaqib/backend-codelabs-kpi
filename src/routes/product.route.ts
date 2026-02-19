import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";
const productRouter = Router();

productRouter.post("/", authenticateToken, roleMiddlewares(["admin", "minister of research", "president", "vice president"]), ProductController.addProduct);
productRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer", "president", "vice president"]), ProductController.findAllProducts);
productRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "lecturer", "president", "vice president"]), ProductController.findProductById);
productRouter.patch("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "president", "vice president"]), ProductController.updateProduct);
productRouter.delete("/:id", authenticateToken, roleMiddlewares(["admin", "minister of research", "president", "vice president"]), ProductController.deleteProduct);
export default productRouter;
