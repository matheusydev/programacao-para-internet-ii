import { Request, Response } from "express";
import { encountersService } from "../services/encounters.service";

export const encountersController = {
  list(req: Request, res: Response) {
    try {
      const encounters = encountersService.list(req.params.id as string);
      res.status(200).json(encounters);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "PATIENT_NOT_FOUND") {
          res.status(404).json({ error: "Paciente nao encontrado." });
          return;
        }
      }
      
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  create(req: Request, res: Response) {
    try {
      const { startedAt, chiefComplaint, notes } = req.body ?? {};
      
      const created = encountersService.create(req.params.id as string, { 
        startedAt, 
        chiefComplaint, 
        notes 
      });
      
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "PATIENT_NOT_FOUND") {
          res.status(404).json({ error: "Paciente nao encontrado." });
          return;
        }
        
        if (error.message === "VALIDATION_FAILED") {
          res.status(400).json({ error: "Erro de validacao nos campos." });
          return;
        }
      }
      
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};