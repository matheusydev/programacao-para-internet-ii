/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO
 * ------------------------------------------------------------
 * Único arquivo autorizado a chamar `fetch`. Mesmo padrão do
 * Mini-Prontuário (Semana 01).
 * ============================================================
 */

const MEDICATIONS_URL = "/api/medications";

// ============================================================
// PASSO 2 — implemente listMedications()
//   const response = await fetch(MEDICATIONS_URL);
//   if (!response.ok) throw new Error(...)
//   return response.json();
// ============================================================
export async function listMedications() {
    const response = await fetch(MEDICATIONS_URL);
    if (!response.ok) {
        throw new Error(`Não foi possível carregar as medicações (HTTP ${response.status})`);
    }

    return response.json();
}
// ============================================================
// PASSO 3 — implemente createMedication(medication)
//   method: "POST", headers Content-Type, body: JSON.stringify(medication)
//   se !response.ok, leia o corpo e jogue o erro com a mensagem do servidor
// ============================================================
export async function createMedication(id,medication_orders) {
    const response = await fetch(`/api/medications/${id}/medication_orders`, {
        method: "POST",
        headers: {
            "Content-Type": "appication/json",
        },
        body: JSON.stringify(medication_orders),
    });

    const data = await response.json()

    if (!response.ok){
        throw new Error(data.error || "Não foi possível criar a medicação.");
    }
}
// ============================================================
// PASSO 4 — implemente getMedication(id)
//   fetch(`${MEDICATIONS_URL}/${id}`)
//   response.status === 404 -> throw new Error("Prescrição não encontrada.")
// ============================================================
export async function getMedication(id){
    const response = await fetch(`/api/medication/${id}`);

    if (response.status === 404) {
        throw new Error("Prescrição não encontrada");
    }

    if (!response.ok) {
        throw new Error(`Falha ao carregar as medicações (HTPP ${response.status})`)
    };

    return response.json();
}

// ============================================================
// PASSO 5 — implemente removeMedication(id)
//   method: "DELETE"
//   sucesso = response.status === 204 (sem corpo, não dá pra fazer .json())
// ============================================================

export async function removeMedication(id) {
    const response = await fetch(`/api/medications/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(
            `Não foi possível remover a medicação (HTTP ${response.status})`
        );
    }
}