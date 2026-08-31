/**
 * ============================================================
 * ORQUESTRAÇÃO
 * ------------------------------------------------------------
 * evento -> ação -> estado -> render -> tela.
 * Sempre nesse sentido.
 * ============================================================
 */

import {
    listMedications,
    createMedication,
    getMedication,
    removeMedication,
} from "./api.js";

import {
    subscribe,
    getState,
    setMedications,
    setError,
    addMedication,
    selectMedication,
    setDetailError,
    removeMedicationFromState,
} from "./state.js";

import {
    renderCounter,
    renderLoading,
    renderError,
    renderMedicationList,
    renderDetail,
} from "./render.js";


const medicationListElement = document.querySelector("#medication-list");
const resultCounterElement = document.querySelector("#result-counter");
const detailPanelElement = document.querySelector("#detail-panel");

const patientNameInput = document.querySelector("#patient-name-input");
const medicationNameInput = document.querySelector("#medication-name-input");
const dosageInput = document.querySelector("#dosage-input");
const routeInput = document.querySelector("#route-input");
const scheduledAtInput = document.querySelector("#scheduled-at-input");
const notesInput = document.querySelector("#notes-input");

const saveButton = document.querySelector("#save-button");
const formFeedbackElement = document.querySelector("#form-feedback");


/**
 * A única função que desenha a tela inteira.
 */
function renderApp(state) {

    if (state.errorMessage) {
        renderError(state.errorMessage, medicationListElement);
        resultCounterElement.textContent = "";
        return;
    }

    if (state.isLoading) {
        renderLoading(medicationListElement);
        resultCounterElement.textContent = "";
        return;
    }

    renderMedicationList(
        state.medications,
        medicationListElement
    );

    renderDetail(
        state,
        detailPanelElement
    );

    renderCounter(
        state.medications.length,
        resultCounterElement
    );
}


subscribe(renderApp);


// ============================================================
// PASSO 2 — carga inicial
// ============================================================

async function start() {

    renderApp(getState());

    try {
        const medications = await listMedications();

        setMedications(medications);

    } catch (error) {
        setError(error.message);
    }
}

start();


// ============================================================
// PASSO 3 — clique em "Cadastrar prescrição"
// ============================================================

saveButton.addEventListener("click", async () => {

    formFeedbackElement.textContent = "";

    const medication = {
        patientName: patientNameInput.value.trim(),
        medicationName: medicationNameInput.value.trim(),
        dosage: dosageInput.value.trim(),
        route: routeInput.value,
        scheduledAt: scheduledAtInput.value,
        notes: notesInput.value.trim(),
    };

    try {

        const createdMedication = await createMedication(medication);

        addMedication(createdMedication);

        patientNameInput.value = "";
        medicationNameInput.value = "";
        dosageInput.value = "";
        scheduledAtInput.value = "";
        notesInput.value = "";

        formFeedbackElement.textContent =
            "Prescrição cadastrada com sucesso.";

    } catch (error) {

        formFeedbackElement.textContent =
            error.message;
    }
});


// ============================================================
// PASSO 4 — clique num cartão da lista
// ============================================================

medicationListElement.addEventListener("click", async (event) => {

    const card = event.target.closest("[data-medication-id]");

    if (!card) return;

    const id = Number(card.dataset.medicationId);

    selectMedication(id);

    try {

        await getMedication(id);

    } catch (error) {

        setDetailError(error.message);
    }
});


// ============================================================
// PASSO 5 — clique em "Suspender"
// ============================================================

detailPanelElement.addEventListener("click", async (event) => {

    if (event.target.id !== "remove-button") return;

    const state = getState();

    if (!state.selectedMedication) return;

    const id = state.selectedMedication.id;

    try {

        await removeMedication(id);

        removeMedicationFromState(id);

    } catch (error) {

        setDetailError(error.message);
    }
});
