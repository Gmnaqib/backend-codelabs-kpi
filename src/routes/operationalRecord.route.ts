import { Router } from "express";
import operationalRecordController from "../controllers/operationalRecord.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const operationalRecordRouter = Router();

operationalRecordRouter.post("/", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, operationalRecordController.createOperationalRecord);
operationalRecordRouter.get("/", authenticateToken, operationalRecordController.getAllOperationalRecords);
operationalRecordRouter.get("/:id", authenticateToken, operationalRecordController.getOperationalRecordById);
operationalRecordRouter.put("/:id", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, operationalRecordController.updateOperationalRecord);
operationalRecordRouter.delete("/:id", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, operationalRecordController.deleteOperationalRecord);

export default operationalRecordRouter;
