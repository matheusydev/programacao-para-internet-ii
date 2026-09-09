import { Router } from "express";
import { patientsController } from "../controllers/patients.controller";

export const patientsRouter = Router();

patientsRouter.get("/", patientsController.list);
patientsRouter.get("/:id", patientsController.getById);
patientsRouter.post("/", patientsController.create);