import { Router } from "express";
import { patientsController } from "../controllers/patients.controller";
import { validate } from "../middlewares/validate";
import { createPatientSchema } from "../validation/patients.schemas";

export const patientsRouter = Router();

patientsRouter.get("/", patientsController.list);
patientsRouter.get("/:id", patientsController.getById);
patientsRouter.post("/", validate(createPatientSchema), patientsController.create);