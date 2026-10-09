/**
 * Controller de MedicationRequest.
 * Traduz HTTP <-> domínio: extrai da requisição o que o service
 * precisa (ids da URL, corpo validado) e entrega só dados simples.
 */
import type { Request, Response } from "express";
import * as medicationsService from "../services/medications.service";

export async function listByEncounter(request: Request, response: Response) {
  const medications = await medicationsService.listMedicationsByEncounter(
    Number(request.params.encounterId),
  );
  response.status(200).json(medications);
}

export async function create(request: Request, response: Response) {
  const created = await medicationsService.createMedication(
    Number(request.params.encounterId),
    request.body,
  );
  response.status(201).json(created);
}