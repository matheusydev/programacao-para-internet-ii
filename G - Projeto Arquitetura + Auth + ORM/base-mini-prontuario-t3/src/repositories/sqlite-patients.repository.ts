/**
 * ADAPTER SQLite de Patient (better-sqlite3).
 *
 * Único tipo de arquivo do sistema que pode importar `src/database`
 * (regra que o TODO ARQ-6 torna executável).
 * Todo o SQL que morava em patients.service.ts está aqui agora.
 */
import { db } from "../database";
import type { NewPatient, Patient, PatientsRepository } from "./patients.repository";

/** Formato da linha como o banco devolve (snake_case, active 0/1). */
type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  photo_url: string | null;
  active: number;
};

/** Tradução banco -> domínio. O formato interno não sai daqui. */
function toPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    photoUrl: row.photo_url,
    active: row.active === 1,
  };
}

const SELECT = "SELECT id, name, birth_date, national_id, photo_url, active FROM patients";

export class SqlitePatientsRepository implements PatientsRepository {
  async findAll(): Promise<Patient[]> {
    const rows = db.prepare(`${SELECT} ORDER BY name`).all() as PatientRow[];
    return rows.map(toPatient);
  }

  async findById(id: number): Promise<Patient | null> {
    const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as PatientRow | undefined;
    return row ? toPatient(row) : null;
  }

  async findByNationalId(nationalId: string): Promise<Patient | null> {
    const row = db.prepare(`${SELECT} WHERE national_id = ?`).get(nationalId) as
      | PatientRow
      | undefined;
    return row ? toPatient(row) : null;
  }

  async create(data: NewPatient): Promise<Patient> {
    // Os `?` separam dado de código: `name` jamais vira comando SQL.
    const result = db
      .prepare(
        `INSERT INTO patients (name, birth_date, national_id, active)
         VALUES (?, ?, ?, 1)`,
      )
      .run(data.name, data.birthDate, data.nationalId);

    const created = await this.findById(Number(result.lastInsertRowid));
    if (!created) {
      // Acabamos de inserir: se não achamos, é bug nosso (vira 500).
      throw new Error("Paciente recém-criado não foi encontrado.");
    }
    return created;
  }

  async updatePhoto(id: number, photoUrl: string): Promise<void> {
    db.prepare("UPDATE patients SET photo_url = ? WHERE id = ?").run(photoUrl, id);
  }
}