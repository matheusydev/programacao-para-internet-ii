/**
 * ============================================================
 * Service de Patient — a camada que DECIDE.
 * ------------------------------------------------------------
 * ARQ-1 feito: o SQL saiu daqui e foi para
 * repositories/sqlite-patients.repository.ts. Este service conhece
 * apenas a INTERFACE PatientsRepository (import type) — quem
 * escolhe a implementação é a montagem em src/app.ts.
 * ============================================================
 */
import { ConflictError, NotFoundError } from "../errors/HttpError";
import type { PatientsRepository } from "../repositories/patients.repository";
import type { CreatePatientInput } from "../validation/patients.schemas";

let repository: PatientsRepository | undefined;

/** Chamado uma única vez, na montagem (app.ts). */
export function configurePatientsRepository(repo: PatientsRepository) {
  repository = repo;
}

function repo(): PatientsRepository {
  if (!repository) {
    // Esquecer a montagem é bug de programação, não do cliente: 500.
    throw new Error("PatientsRepository não configurado (veja src/app.ts).");
  }
  return repository;
}

export async function listPatients() {
  return repo().findAll();
}

export async function getPatientById(id: number) {
  const patient = await repo().findById(id);
  if (!patient) {
    // "Não encontrei" não é problema do servidor: é 404, não 500.
    throw new NotFoundError("Paciente não encontrado.");
  }
  return patient;
}

export async function createPatient(input: CreatePatientInput) {
  // Invariante N1: CNS único. A checagem é regra de negócio, por
  // isso fica no service; o UNIQUE do banco fecha a janela de corrida.
  const duplicate = await repo().findByNationalId(input.nationalId);
  if (duplicate) {
    throw new ConflictError("Já existe um paciente com este CNS.");
  }
  return repo().create(input);
}

export async function setPatientPhoto(id: number, photoUrl: string) {
  await getPatientById(id); // garante o 404 antes de gravar
  await repo().updatePhoto(id, photoUrl);
  return getPatientById(id);
}