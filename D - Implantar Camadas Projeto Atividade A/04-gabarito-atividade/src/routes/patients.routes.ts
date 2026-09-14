import { Router } from "express";
import { patientsController } from "../controllers/patients.controller";
import { validate } from "../middlewares/validate";
import { createPatientSchema } from "../validation/patients.schemas";
import { uploadPhoto } from "../middlewares/upload";

export const patientsRouter = Router();

patientsRouter.get("/", patientsController.list);
patientsRouter.get("/:id", patientsController.getById);
patientsRouter.post("/", validate(createPatientSchema), patientsController.create);
patientsRouter.post("/:id/photo", uploadPhoto.single("photo"), patientsController.uploadPhoto);