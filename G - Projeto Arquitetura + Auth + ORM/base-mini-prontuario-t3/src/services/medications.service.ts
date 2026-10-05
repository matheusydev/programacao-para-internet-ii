/**
 * Service de MedicationRequest (a prescrição de um atendimento).
 *
 * ARQ-3 feito: o SQL saiu daqui e foi para
 * repositories/sqlite-medications.repository.ts. Este service conhece
 * apenas a INTERFACE MedicationsRepository (import type) — quem
 * escolhe a implementação é a montagem em src/app.ts.
 */
import type { Request } from "express";
import type { MedicationsRepository } from "../repositories/medications.repository";
import { getEncounterById } from "./encounters.service";
import type { CreateMedicationInput } from "../validation/medications.schemas";

let repository: MedicationsRepository | undefined;

/** Chamado uma única vez, na montagem (app.ts). */
export function configureMedicationsRepository(repo: MedicationsRepository) {
  repository = repo;
}

function repo(): MedicationsRepository {
  if (!repository) {
    // Esquecer a montagem é bug de programação, não do cliente: 500.
    throw new Error("MedicationsRepository não configurado (veja src/app.ts).");
  }
  return repository;
}

export async function listMedicationsByEncounter(request: Request) {
  const encounterId = Number(request.params.encounterId);
  await getEncounterById(encounterId); // 404 se o atendimento não existe
  return repo().findByEncounterId(encounterId);
}

export async function createMedication(encounterId: number, input: CreateMedicationInput) {
  await getEncounterById(encounterId); // 404 se o atendimento não existe

  // O atendimento vem da URL e o resto do corpo: aqui os dois viram um
  // único NewMedicationRequest, campo a campo.
  return repo().create({
    encounterId,
    medication: input.medication,
    dosage: input.dosage,
  });
}