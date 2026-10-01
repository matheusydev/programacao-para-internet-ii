/**
 * ADAPTER SQLite de Encounter (better-sqlite3).
 *
 * Recebe o SQL que morava em encounters.service.ts. Assim como o
 * adapter de Patient, é o único tipo de arquivo autorizado a
 * importar `src/database`.
 */
import { db } from "../database";
import type { Encounter, EncountersRepository, NewEncounter } from "./encounters.repository";

/** Formato da linha como o banco devolve (snake_case). */
type EncounterRow = {
  id: number;
  patient_id: number;
  started_at: string;
  chief_complaint: string;
  notes: string | null;
};

/** Tradução banco -> domínio. O formato interno não sai daqui. */
function toEncounter(row: EncounterRow): Encounter {
  return {
    id: row.id,
    patientId: row.patient_id,
    startedAt: row.started_at,
    chiefComplaint: row.chief_complaint,
    notes: row.notes,
  };
}

const SELECT = "SELECT id, patient_id, started_at, chief_complaint, notes FROM encounters";

export class SqliteEncountersRepository implements EncountersRepository {
  async findByPatientId(patientId: number): Promise<Encounter[]> {
    // Ordenamos no SQL: o banco tem índice e o dado chega pronto.
    // A ordem é exigência do contrato (ver o port).
    const rows = db
      .prepare(`${SELECT} WHERE patient_id = ? ORDER BY started_at DESC`)
      .all(patientId) as EncounterRow[];
    return rows.map(toEncounter);
  }

  async findById(id: number): Promise<Encounter | null> {
    const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as EncounterRow | undefined;
    return row ? toEncounter(row) : null;
  }

  async create(data: NewEncounter): Promise<Encounter> {
    const result = db
      .prepare(
        `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
         VALUES (?, ?, ?, ?)`,
      )
      .run(data.patientId, data.startedAt, data.chiefComplaint, data.notes);

    const created = await this.findById(Number(result.lastInsertRowid));
    if (!created) {
      // Acabamos de inserir: se não achamos, é bug nosso (vira 500).
      throw new Error("Atendimento recém-criado não foi encontrado.");
    }
    return created;
  }
}