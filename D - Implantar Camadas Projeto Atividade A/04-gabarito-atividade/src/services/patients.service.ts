import { db } from "../db/database";

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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
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
    
    create(data: { name: string, birthDate: string, nationalId: string}) {
        if (
            isBlank(data.name) ||
            isBlank(data.birthDate) ||
            !ISO_DATE.test(data.birthDate) ||
            isBlank(data.nationalId)
        ) {
            throw new Error("VALIDATION_FAILED");
        }
        
        const duplicate = db
            .prepare("SELECT id FROM patients WHERE national_id = ?")
            .get(data.nationalId.trim());
    
        if (duplicate) {
            throw new Error("DUPLICATE_CNS");
        }

        const result = db
            .prepare(
                `INSERT INTO patients (name, birth_date, national_id, active)
                VALUES (?, ?, ?, 1)`
            )
            .run(data.name.trim(), data.birthDate, data.nationalId.trim())
        
        const created = db
            .prepare("SELECT id, name, birth_date, national_id, active FROM patients WHERE id = ?")
            .get(result.lastInsertRowid) as PatientRow;
        
        return toPatientJson(created);
    },
};