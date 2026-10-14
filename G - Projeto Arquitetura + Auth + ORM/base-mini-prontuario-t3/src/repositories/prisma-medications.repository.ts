/**
 * ADAPTER Prisma de MedicationRequest — irmão gêmeo do
 * SqliteMedicationsRepository. Cumpre o MESMO port
 * (MedicationsRepository), inclusive a ordem por id crescente.
 */
import type { MedicationRequest as MedicationRequestRecord } from "@prisma/client";
import { prisma } from "./prisma-client";
import type {
  MedicationRequest,
  MedicationsRepository,
  NewMedicationRequest,
} from "./medications.repository";

/** Tradução registro do Prisma -> domínio, campo a campo. */
function toMedicationRequest(record: MedicationRequestRecord): MedicationRequest {
  return {
    id: record.id,
    encounterId: record.encounterId,
    medication: record.medication,
    dosage: record.dosage,
  };
}

export class PrismaMedicationsRepository implements MedicationsRepository {
  async findByEncounterId(encounterId: number): Promise<MedicationRequest[]> {
    // Id que não é inteiro não tem prescrições: lista vazia, como o port promete.
    if (!Number.isInteger(encounterId)) return [];

    const records = await prisma.medicationRequest.findMany({
      where: { encounterId },
      // A ordem é exigência do contrato: id crescente, a ordem em que
      // as prescrições foram feitas.
      orderBy: { id: "asc" },
    });
    return records.map(toMedicationRequest);
  }

  async create(data: NewMedicationRequest): Promise<MedicationRequest> {
    // O Prisma devolve o registro completo: a releitura que o adapter
    // SQLite precisava fazer depois do INSERT simplesmente some.
    const record = await prisma.medicationRequest.create({
      data: {
        encounterId: data.encounterId,
        medication: data.medication,
        dosage: data.dosage,
      },
    });
    return toMedicationRequest(record);
  }
}
