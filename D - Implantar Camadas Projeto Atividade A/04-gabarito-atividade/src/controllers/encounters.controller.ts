import { Request, Response } from "express";
import { encountersService } from "../services/encounters.service";

export const encountersController = {
  list(req: Request, res: Response) {
    const encounters = encountersService.list(req.params.id as string);
    res.status(200).json(encounters);
  },

  create(req: Request, res: Response) {
    const { startedAt, chiefComplaint, notes } = req.body ?? {};
    
    const created = encountersService.create(req.params.id as string, { 
      startedAt, 
      chiefComplaint, 
      notes 
    });
    
    res.status(201).json(created);
  },
};