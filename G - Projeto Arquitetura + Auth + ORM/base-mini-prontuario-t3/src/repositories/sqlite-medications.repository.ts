/**
 * ADAPTER SQLite de MedicationRequest (better-sqlite3).
 *
 * Recebe o SQL que morava em medications.service.ts. Assim como os
 * adapters de Patient e Encounter, é o único tipo de arquivo
 * autorizado a importar `src/database`.
 */
import { db } from "../database";
import type {
  MedicationRequest,
  MedicationsRepository,
  NewMedicationRequest,
} from "./medications.repository";

/** Formato da linha como o banco devolve (snake_case). */
type MedicationRow = {
  id: number;
  encounter_id: number;
  medication: string;
  dosage: string;
};

/** Tradução banco -> domínio. O formato interno não sai daqui. */
function toMedicationRequest(row: MedicationRow): MedicationRequest {
  return {
    id: row.id,
    encounterId: row.encounter_id,
    medication: row.medication,
    dosage: row.dosage,
  };
}

const SELECT = "SELECT id, encounter_id, medication, dosage FROM medication_requests";

export class SqliteMedicationsRepository implements MedicationsRepository {
  async findByEncounterId(encounterId: number): Promise<MedicationRequest[]> {
    // A ordem (id crescente = ordem em que foram prescritas) é
    // exigência do contrato (ver o port).
    const rows = db
      .prepare(`${SELECT} WHERE encounter_id = ? ORDER BY id`)
      .all(encounterId) as MedicationRow[];
    return rows.map(toMedicationRequest);
  }

  async create(data: NewMedicationRequest): Promise<MedicationRequest> {
    const result = db
      .prepare(
        `INSERT INTO medication_requests (encounter_id, medication, dosage)
         VALUES (?, ?, ?)`,
      )
      .run(data.encounterId, data.medication, data.dosage);

    // O INSERT só devolve o id gerado: relemos a linha para cumprir o
    // contrato (devolver a prescrição completa). Detalhe do better-sqlite3,
    // por isso fica aqui e não vira método do port.
    const row = db.prepare(`${SELECT} WHERE id = ?`).get(result.lastInsertRowid) as
      | MedicationRow
      | undefined;
    if (!row) {
      // Acabamos de inserir: se não achamos, é bug nosso (vira 500).
      throw new Error("Prescrição recém-criada não foi encontrada.");
    }
    return toMedicationRequest(row);
  }
}