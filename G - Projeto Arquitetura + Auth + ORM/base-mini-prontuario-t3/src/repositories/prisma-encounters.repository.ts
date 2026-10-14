/**
 * ADAPTER Prisma de Encounter — irmão gêmeo do SqliteEncountersRepository.
 * Cumpre o MESMO port (EncountersRepository), inclusive a ordem que o
 * contrato exige em findByPatientId.
 */
import type { Encounter as EncounterRecord } from "@prisma/client";
import { prisma } from "./prisma-client";
import type { Encounter, EncountersRepository, NewEncounter } from "./encounters.repository";

/** Tradução registro do Prisma -> domínio, campo a campo. */
function toEncounter(record: EncounterRecord): Encounter {
  return {
    id: record.id,
    patientId: record.patientId,
    startedAt: record.startedAt,
    chiefComplaint: record.chiefComplaint,
    notes: record.notes,
  };
}

export class PrismaEncountersRepository implements EncountersRepository {
  async findByPatientId(patientId: number): Promise<Encounter[]> {
    // Id que não é inteiro não tem atendimentos: lista vazia, como o port promete.
    if (!Number.isInteger(patientId)) return [];

    const records = await prisma.encounter.findMany({
      where: { patientId },
      // A ordem é exigência do contrato (ver o port): mais recente primeiro.
      orderBy: { startedAt: "desc" },
    });
    return records.map(toEncounter);
  }

  async findById(id: number): Promise<Encounter | null> {
    // Mesmo cuidado do adapter de Patient: NaN "não existe" (404), e não 500.
    if (!Number.isInteger(id)) return null;

    const record = await prisma.encounter.findUnique({ where: { id } });
    return record ? toEncounter(record) : null;
  }

  async create(data: NewEncounter): Promise<Encounter> {
    const record = await prisma.encounter.create({
      data: {
        patientId: data.patientId,
        startedAt: data.startedAt,
        chiefComplaint: data.chiefComplaint,
        notes: data.notes,
      },
    });
    return toEncounter(record);
  }
}