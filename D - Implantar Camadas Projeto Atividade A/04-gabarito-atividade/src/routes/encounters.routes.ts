import { Router } from "express";
import { encountersController } from "../controllers//encounters.controller";

export const encountersRouter = Router({ mergeParams: true});

encountersRouter.get("/", encountersController.list);
encountersRouter.post("/", encountersController.create);