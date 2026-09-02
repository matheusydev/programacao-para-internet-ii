/**
 * ============================================================
 * Painel de Medicacao - Servidor HTTP
 * ============================================================
 * Isto e um "Hello World": so a rota de saude e o servidor
 * estatico. As quatro rotas da atividade (listar, criar, obter
 * um, remover) ainda nao existem — sao o que voce vai construir.
 */
import express from "express";
import { db } from "./database";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

// ============================================================
// PASSO 1 — GET /api/medications
//   db.prepare("SELECT ... FROM medication_orders").all()
//   Nao esqueca de traduzir snake_case -> camelCase antes de responder.
// ============================================================

app.get("/api/medications", (_request, response) => {
  const medicacoes = db
    .prepare(`SELECT 
      id,
      patient_name,
      medication_name,
      dosage,
      route,
      scheduled_at,
      notes
    FROM medication_orders
    ORDER BY patient_name`).all();

  response.status(200).json(medicacoes.map((medicacao: any) => ({
    id: medicacao.id, 
    patientName: medicacao.patient_name, 
    medicationName: medicacao.medication_name, 
    dosage: medicacao.dosage, 
    route: medicacao.route, 
    scheduledAt: medicacao.scheduled_at, 
    notes: medicacao.notes
})))
});

// ============================================================
// PASSO 3 — POST /api/medications
//   valide patientName, medicationName, dosage, route, scheduledAt
//   INSERT parametrizado -> responda 201 com o registro criado
// ============================================================

app.post("/api/medications", (request, response) => {
    const {
        patientName,
        medicationName,
        dosage,
        route,
        scheduledAt,
        notes,
    } = request.body;

    if (
        typeof patientName !== "string" ||
        patientName.trim() === ""
    ) {
        return response
            .status(400)
            .json({ error: "patientName é obrigatório." });
    }

    if (
        typeof medicationName !== "string" ||
        medicationName.trim() === ""
    ) {
        return response
            .status(400)
            .json({ error: "medicationName é obrigatório." });
    }

    if (
        typeof dosage !== "string" ||
        dosage.trim() === ""
    ) {
        return response
            .status(400)
            .json({ error: "dosage é obrigatório." });
    }

    if (
        typeof route !== "string" ||
        !["Oral", "Intravenosa", "Intramuscular"].includes(route)
    ) {
        return response
            .status(400)
            .json({ error: "route inválida." });
    }

    if (
        typeof scheduledAt !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(scheduledAt)
    ) {
        return response
            .status(400)
            .json({
                error: "scheduledAt deve estar no formato AAAA-MM-DDTHH:MM.",
            });
    }

    const medicationNotes =
        typeof notes === "string" && notes.trim() !== ""
            ? notes.trim()
            : null;

    const result = db
        .prepare(`
            INSERT INTO medication_orders (
                patient_name,
                medication_name,
                dosage,
                route,
                scheduled_at,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
            patientName.trim(),
            medicationName.trim(),
            dosage.trim(),
            route,
            scheduledAt,
            medicationNotes
        );

    const medication = db
        .prepare(`
            SELECT
                id,
                patient_name,
                medication_name,
                dosage,
                route,
                scheduled_at,
                notes
            FROM medication_orders
            WHERE id = ?
        `)
        .get(result.lastInsertRowid);

    const item = medication as any;

    return response.status(201).json({
        id: item.id,
        patientName: item.patient_name,
        medicationName: item.medication_name,
        dosage: item.dosage,
        route: item.route,
        scheduledAt: item.scheduled_at,
        notes: item.notes,
    });
});
// ============================================================
// PASSO 4 — GET /api/medications/:id
//   db.prepare("SELECT ... WHERE id = ?").get(id)
//   undefined -> 404
// ============================================================
app.get("/api/medications/:id", (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return response
            .status(400)
            .json({ error: "ID inválido." });
    }

    const medication = db
        .prepare(`
            SELECT
                id,
                patient_name,
                medication_name,
                dosage,
                route,
                scheduled_at,
                notes
            FROM medication_orders
            WHERE id = ?
        `)
        .get(id);

    if (!medication) {
        return response
            .status(404)
            .json({ error: "Prescrição não encontrada." });
    }

    const item = medication as any;

    return response.status(200).json({
        id: item.id,
        patientName: item.patient_name,
        medicationName: item.medication_name,
        dosage: item.dosage,
        route: item.route,
        scheduledAt: item.scheduled_at,
        notes: item.notes,
    });
});
// ============================================================
// PASSO 5 — DELETE /api/medications/:id
//   db.prepare("DELETE FROM medication_orders WHERE id = ?").run(id)
//   responda 204, sem corpo
// ============================================================

app.delete("/api/medications/:id", (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return response
            .status(400)
            .json({ error: "ID inválido." });
    }

    const result = db
        .prepare(`
            DELETE FROM medication_orders
            WHERE id = ?
        `)
        .run(id);

    if (result.changes === 0) {
        return response
            .status(404)
            .json({ error: "Prescrição não encontrada." });
    }

    return response.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Painel de Medicacao no ar em http://localhost:${PORT}`);
});