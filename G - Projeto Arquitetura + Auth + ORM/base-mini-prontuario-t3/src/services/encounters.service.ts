/**
 * Service de Encounter.
 *
 * ARQ-2 feito: o SQL saiu daqui e foi para
 * repositories/sqlite-encounters.repository.ts. Este service conhece
 * apenas a INTERFACE EncountersRepository (import type) — quem
 * escolhe a implementação é a montagem em src/app.ts.
 *
 * TODO AUTH-8 — (parte NÃO guiada) quando `professional_id`
 * existir em encounters, `createEncounter` passa a registrar
 * QUEM registrou — e nasce aqui a regra de domínio da matriz
 * de permissões que middleware nenhum resolve sozinho.
 */
import { NotFoundError } from "../errors/HttpError";
import type { EncountersRepository } from "../repositories/encounters.repository";
import { getPatientById } from "./patients.service";
import type { CreateEncounterInput } from "../validation/encounters.schemas";

let repository: EncountersRepository | undefined;

/** Chamado uma única vez, na montagem (app.ts). */
export function configureEncountersRepository(repo: EncountersRepository) {
  repository = repo;
}

function repo(): EncountersRepository {
  if (!repository) {
    // Esquecer a montagem é bug de programação, não do cliente: 500.
    throw new Error("EncountersRepository não configurado (veja src/app.ts).");
  }
  return repository;
}

export async function listEncountersByPatient(patientId: number) {
  await getPatientById(patientId); // 404 se o paciente não existe
  return repo().findByPatientId(patientId);
}

export async function getEncounterById(id: number) {
  const encounter = await repo().findById(id);
  if (!encounter) {
    throw new NotFoundError("Atendimento não encontrado.");
  }
  return encounter;
}

export async function createEncounter(patientId: number, input: CreateEncounterInput) {
  await getPatientById(patientId); // 404 se o paciente não existe

  // O paciente vem da URL e o resto do corpo: aqui os dois viram um
  // único NewEncounter. A ausência de conduta é normalizada para null.
  return repo().create({
    patientId,
    startedAt: input.startedAt,
    chiefComplaint: input.chiefComplaint,
    notes: input.notes ?? null,
  });
}
