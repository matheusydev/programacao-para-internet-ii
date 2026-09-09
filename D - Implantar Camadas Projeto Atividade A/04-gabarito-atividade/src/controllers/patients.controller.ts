import { Request, Response } from "express";
import { patientsService } from "../services/patients.service";

export const patientsController = {
  list(_req: Request, res: Response) {
    const patients = patientsService.list();
    res.status(200).json(patients);
  },

  getById(req: Request, res: Response) {
    const patient = patientsService.getById(req.params.id as string);
    
    if (!patient) {
      res.status(404).json({ error: "Paciente nao encontrado." });
      return;
    }
    
    res.status(200).json(patient);
  },

  create(req: Request, res: Response) {
    try {
      const { name, birthDate, nationalId } = req.body || {};
      const created = patientsService.create({ name, birthDate, nationalId });
      
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "VALIDATION_FAILED") {
          res.status(400).json({ error: "Erro de validacao nos campos." });
          return;
        }
        
        if (error.message === "DUPLICATE_CNS") {
          res.status(409).json({ error: "Ja existe um paciente com este CNS." });
          return;
        }
      }
      
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};