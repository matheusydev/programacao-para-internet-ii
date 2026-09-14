import { Request, Response } from "express";
import { patientsService } from "../services/patients.service";
import { NotFoundError, UnprocessableEntityError } from "../errors/HttpError";
import { uploadPhoto } from "../middlewares/upload";

export const patientsController = {
  list(_req: Request, res: Response) {
    const patients = patientsService.list();
    res.status(200).json(patients);
  },

  getById(req: Request, res: Response) {
    const patient = patientsService.getById(req.params.id as string);
    
    if (!patient) {
      throw new NotFoundError("Paciente não encontrado.");
    }
    
    res.status(200).json(patient);
  },

  create(req: Request, res: Response) {
    const { name, birthDate, nationalId } = req.body || {};

    const created = patientsService.create({ name, birthDate, nationalId });
    
    res.status(201).json(created);
  },

  uploadPhoto(req: Request, res: Response) {
    if (!req.file) {
      throw new UnprocessableEntityError("Nenhum arquivo enviado.");
    }

    const updatedPatient = patientsService.setPhoto(req.params.id as string, req.file.filename);
    res.status(200).json(updatedPatient);
  }
};