import { Router } from "express";
import operationalRecordController from "../controllers/operationalRecord.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { roleMiddlewares } from "../middlewares/role.middlewares";

const operationalRecordRouter = Router();

operationalRecordRouter.post("/", authenticateToken, operationalRecordController.createOperationalRecord);
operationalRecordRouter.get("/", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), operationalRecordController.getAllOperationalRecords);
operationalRecordRouter.get("/:id", authenticateToken, roleMiddlewares(["admin", "minister of operation"]), operationalRecordController.getOperationalRecordById);
operationalRecordRouter.delete("/:id", roleMiddlewares(["admin", "minister of operation"]), authenticateToken, operationalRecordController.deleteOperationalRecord);

export default operationalRecordRouter;