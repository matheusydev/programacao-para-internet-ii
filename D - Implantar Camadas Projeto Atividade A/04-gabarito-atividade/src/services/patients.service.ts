import { id } from "zod/locales";
import { db } from "../db/database";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/HttpError";
import { string } from "zod";

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  active: number;
};

function toPatientJson(row: PatientRow) {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    active: row.active === 1,
  };
}

export const patientsService = {
  list() {
    const rows = db
      .prepare("SELECT id, name, birth_date, national_id, active FROM patients ORDER BY name")
      .all() as PatientRow[];
    return rows.map(toPatientJson);
  },

  getById(id: string) {
    const row = db
      .prepare("SELECT id, name, birth_date, national_id, active FROM patients WHERE id = ?")
      .get(id) as PatientRow | undefined;

    if (!row) {
      return null;
    }
    return toPatientJson(row);
  },

  exists(id: string): boolean {
    return db.prepare("SELECT 1 FROM patients WHERE id = ?").get(id) !== undefined;
  },

  create(data: { name: string; birthDate: string; nationalId: string }) {

    const duplicate = db
      .prepare("SELECT id FROM patients WHERE national_id = ?")
      .get(data.nationalId.trim());

    if (duplicate) {
      throw new ConflictError("Ja existe um paciente com este CNS.");
    }

    const result = db
      .prepare(
        `INSERT INTO patients (name, birth_date, national_id, active)
         VALUES (?, ?, ?, 1)`
      )
      .run(data.name.trim(), data.birthDate, data.nationalId.trim());

    const created = db
      .prepare("SELECT id, name, birth_date, national_id, active FROM patients WHERE id = ?")
      .get(result.lastInsertRowid) as PatientRow;

    return toPatientJson(created);

  },

  setPhoto(id: string, filename: string) {
    const row = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
      .get(id) as PatientRow | undefined;
    
    if (!row) {
      throw new NotFoundError(`O paciente ${id} não foi encontrado`, { 
      patientId: id});
    }

    const photoPath = `/uploads/${filename}`;

    db.prepare("UPDATE patients SET photo_path = ? WHERE id = ?")
      .run(photoPath, id);

    const updated = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
      .get(id) as PatientRow;

      return toPatientJson(updated);
  },
};