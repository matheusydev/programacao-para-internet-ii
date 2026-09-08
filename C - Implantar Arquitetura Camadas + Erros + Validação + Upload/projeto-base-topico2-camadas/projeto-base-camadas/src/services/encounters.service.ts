/**
 * ============================================================
 * TODO 6 -- Service de Encounter
 * ============================================================
 * Migre para ca: a verificacao patientExists, a query de list
 * (ordenada por started_at DESC), a validacao + insert de
 * create, e a funcao toEncounterJson.
 *
 *   export const encountersService = {
 *     list(patientId: string) { ... },
 *     create(patientId: string, data: { startedAt: string; chiefComplaint: string; notes?: string }) { ... },
 *   };
 * ============================================================
 */

import { db } from "../db/database.ts";
import { patientsService } from "./patients.service.ts";

type EncounterRow = {
  id: number;
  patient_id: number;
  started_at: string;
  chief_complaint: string;
  notes: string | null;
};

function toEncounterJson(row: EncounterRow) {
  return {
    id: row.id,
    patientId: row.patient_id,
    startedAt: row.started_at,
    chiefComplaint: row.chief_complaint,
    notes: row.notes,
  };
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

export const encountersService = {
  list(patientId: string) {
    if (!patientsService.exists(patientId)) {
      throw new Error("PATIENT_NOT_FOUND");
    }

    const rows = db
      .prepare(
        `SELECT id, patient_id, started_at, chief_complaint, notes
         FROM encounters
         WHERE patient_id = ?
         ORDER BY started_at DESC`
      )
      .all(patientId) as EncounterRow[];

    return rows.map(toEncounterJson);
  },

  create(
    patientId: string,
    data: { startedAt: string; chiefComplaint: string; notes?: string }
  ) {
    if (!patientsService.exists(patientId)) {
      throw new Error("PATIENT_NOT_FOUND");
    }

    if (
      isBlank(data.chiefComplaint) ||
      isBlank(data.startedAt) ||
      !ISO_DATE_TIME.test(data.startedAt)
    ) {
      throw new Error("VALIDATION_FAILED");
    }

    const result = db
      .prepare(
        `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
         VALUES (?, ?, ?, ?)`
      )
      .run(
        patientId,
        data.startedAt,
        data.chiefComplaint.trim(),
        data.notes ? data.notes.trim() : null
      );

    const created = db
      .prepare(
        `SELECT id, patient_id, started_at, chief_complaint, notes
         FROM encounters WHERE id = ?`
      )
      .get(result.lastInsertRowid) as EncounterRow;

    return toEncounterJson(created);
  },
};