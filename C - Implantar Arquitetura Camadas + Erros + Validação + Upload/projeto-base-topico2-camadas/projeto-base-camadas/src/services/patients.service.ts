/**
 * ============================================================
 * TODO 3 -- Service de Patient
 * ============================================================
 * O Service e onde mora a regra de negocio de verdade: o SQL
 * (db.prepare), a checagem de CNS duplicado (409), a traducao
 * snake_case -> camelCase (toPatientJson).
 *
 * O Service NUNCA:
 *   - conhece req/res (nao sabe que existe HTTP)
 *   - formata resposta HTTP
 *
 * Quando algo da errado (paciente nao encontrado, CNS
 * duplicado), por enquanto o Service pode continuar devolvendo
 * um valor especial (ex.: null) OU lancando um Error comum --
 * a hierarquia HttpError chega no TODO 8 (Encontro 2). Combine
 * com a dupla como vao sinalizar "nao encontrado" antes disso
 * existir.
 *
 * Migre para ca: a query de list, a query de getById, a
 * checagem de duplicata + insert de create, e a funcao
 * toPatientJson (que hoje esta em server.ts).
 *
 * Dica de assinatura:
 *   export const patientsService = {
 *     list() { ... },
 *     getById(id: string) { ... },
 *     create(data: { name: string; birthDate: string; nationalId: string }) { ... },
 *   };
 * ============================================================
 */
import { db } from "../db/database.ts";
import { BadRequestError, ConflictError, NotFoundError, UnprocessableEntityError } from "../errors/HttpError.ts";

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  active: number;
  photo_path: string | null;
};

function toPatientJson(row: PatientRow) {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    active: row.active === 1,
    photoUrl: row.photo_path,
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

export const patientsService = {
  list() {
    const rows = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients ORDER BY name")
      .all() as PatientRow[];
    
    return rows.map(toPatientJson);
  },

  getById(id: string) {
    const row = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
      .get(id) as PatientRow | undefined;
    
    if (!row) {
      throw new NotFoundError(`O paciente ${id} não foi encontrado`, {patientId: id});
    }
    
    return toPatientJson(row);
  },

  exists(id: string): boolean {
    return db.prepare("SELECT 1 FROM patients WHERE id = ?").get(id) !== undefined;
  },

  create(data: { name: string; birthDate: string; nationalId: string }) {
    if (
      isBlank(data.name) ||
      isBlank(data.birthDate) ||
      isBlank(data.nationalId)
    ) {
      throw new BadRequestError("name, birthDate e nationalId são obrigatórios");
    }
    if (
      !ISO_DATE.test(data.birthDate)
    ) {
      throw new UnprocessableEntityError("birthDate deve estar no formato ISO (AAAA-MM-DDTHH:MM)",
      { startedAt: data.birthDate })
    }

    const duplicate = db
      .prepare("SELECT id FROM patients WHERE national_id = ?")
      .get(data.nationalId.trim());
    
    if (duplicate) {
      throw new ConflictError(`cns ${data.nationalId} já cadastrado`, {nationalId: data.nationalId});
    }

    const result = db
      .prepare(
        `INSERT INTO patients (name, birth_date, national_id, active)
         VALUES (?, ?, ?, 1)`
      )
      .run(data.name.trim(), data.birthDate, data.nationalId.trim());

    const created = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
      .get(result.lastInsertRowid) as PatientRow;

    return toPatientJson(created);
  },

  setPhoto(id: string, filename: string) {
    const row = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
      .get(id) as PatientRow | undefined;

    if (!row) {
      throw new NotFoundError(`O paciente ${id} não foi encontrado`, { patientId: id });
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

export {ISO_DATE};

/**
 * ============================================================
 * TODO 13 (Encontro 2, continuacao) -- Service de upload
 * ============================================================
 * setPhoto(id, filename):
 *   - busca o paciente (senao existir -> throw NotFoundError)
 *   - UPDATE patients SET photo_path = ? WHERE id = ?
 *     (salve como `/uploads/${filename}`)
 *   - devolve o paciente atualizado (toPatientJson)
 * ============================================================
 */

