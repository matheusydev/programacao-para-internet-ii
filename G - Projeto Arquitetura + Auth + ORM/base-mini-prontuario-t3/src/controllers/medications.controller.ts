/**
 * Controller de MedicationRequest.
 */
import type { Request, Response } from "express";
import * as medicationsService from "../services/medications.service";

export async function listByEncounter(request: Request, response: Response) {
  const medications = await medicationsService.listMedicationsByEncounter(request);
  response.status(200).json(medications);
}

export async function create(request: Request, response: Response) {
  const created = await medicationsService.createMedication(
    Number(request.params.encounterId),
    request.body,
  );
  response.status(201).json(created);
}
