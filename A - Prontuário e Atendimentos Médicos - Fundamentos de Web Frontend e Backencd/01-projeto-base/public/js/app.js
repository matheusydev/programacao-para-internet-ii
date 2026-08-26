/**
 * ============================================================
 * ORQUESTRAÇÃO
 * ------------------------------------------------------------
 * Este arquivo é o maestro. Ele não guarda estado e não desenha
 * nada sozinho. Ele apenas:
 *
 *   1. liga eventos do usuário às AÇÕES do estado
 *   2. manda a tela ser redesenhada quando o estado muda
 *   3. dispara a carga inicial dos dados
 *
 * O fluxo é sempre o mesmo, e sempre em um sentido só:
 *
 *   evento  ->  ação  ->  estado  ->  render  ->  tela
 *
 * Nunca o contrário. A tela nunca é a fonte da verdade.
 * ============================================================
 */
import { createEncounter, getPatient, listEncounters, listPatients } from "./api.js";
import { subscribe, getState, setPatients, setSearchTerm, setOnlyActive, setError, 
         setSelectedPatient, setEncounters, setEncountersError, setFormError, startEncountersLoading, clearSelectedPatient } from "./state.js";
import { renderPatientList, renderCounter, renderLoading, renderError, renderEncounterList, renderPatientDetail, renderEncounterError } from "./render.js";

/* --- Os elementos que existem na página. Buscamos UMA vez. --- */
const searchInput = document.querySelector("#search-input");
const onlyActiveInput = document.querySelector("#only-active-input");
const patientListElement = document.querySelector("#patient-list");
const resultCounterElement = document.querySelector("#result-counter");
const patientsScreen = document.querySelector('#patients-screen');
const patientDetailScreen = document.querySelector('#patient-detail-screen');
const backToPatientsButton = document.querySelector('#back-to-patients');
const patientDetailName = document.querySelector('#patient-detail-name');
const patientDetailBirthDate = document.querySelector('#patient-detail-birth-date');
const patientDetailNationalId = document.querySelector('#patient-detail-national-id');
const encounterListElement = document.querySelector('#encounter-list');
const encounterForm = document.querySelector('#encounter-form');
const encounterFormError = document.querySelector('#encounter-form-error');

backToPatientsButton.addEventListener("click", () => {
  clearSelectedPatient();
})

encounterForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const state = getState();

  if (!state.selectedPatient) {
    return;
  }

  const formData = new FormData(encounterForm);

  const encounter = {
    startedAt: formData.get("startedAt"),
    chiefComplaint: formData.get("chiefComplaint"),
    notes: formData.get("notes")
  };

  try {
    const createdEncounter =
      await createEncounter(
        state.selectedPatient.id,
        encounter
      );
    
    setFormError(null);

    setEncounters([
      ...state.encounters,
      createdEncounter
    ]);

    encounterForm.reset();

  } catch (error) {
    setFormError(error.message);
  }
});
/**
 * A ÚNICA função que desenha a tela inteira.
 * Ela é chamada toda vez que o estado muda — e apenas por isso.
 */
function renderApp(state) {
  if (state.selectedPatient) {
    patientsScreen.hidden = true;
    patientDetailScreen.hidden = false;

    renderPatientDetail(
      state.selectedPatient,
      {
        name: patientDetailName,
        birthDate: patientDetailBirthDate,
        nationalId: patientDetailNationalId
      }
    );

    if (state.encountersLoading) {
      encounterListElement.innerHTML = "<p>Carregando atendimentos...</p>";
    }
    else if (state.encountersError) {
      renderEncounterError(
        state.encountersError,
        encounterListElement
      );
    }
    else {
      renderEncounterList(
        state.encounters,
        encounterListElement
      );
    }

    encounterFormError.textContent =
      state.formError || "";
    
    return;
  }

  patientsScreen.hidden = false;
  patientDetailScreen.hidden = true;

  if (state.errorMessage) {
    renderError(state.errorMessage, patientListElement);
    resultCounterElement.textContent = "";
    return;
  }

  if (state.isLoading) {
    renderLoading(patientListElement);
    resultCounterElement.textContent = "";
    return;
  }

  renderPatientList(state.visiblePatients, state.searchTerm, patientListElement);
  renderCounter(state.visiblePatients.length, state.patients.length, resultCounterElement);
}

/*Clique em um paciente*/
patientListElement.addEventListener("click", async (event) => {
  const card = event.target.closest("[data-patient-id]");

  if (!card) {
    return;
  }

  const patientId = Number(card.dataset.patientId);

  try {
    const patient = await getPatient(patientId);

    setSelectedPatient(patient);
    startEncountersLoading();

    try {
      const encounters = await listEncounters(patientId);

      setEncounters(encounters);
    } catch (error) {
      setEncountersError(error.message);
    }

  } catch (error) {
    setError(error.message);
  }
});

/* --- Eventos do usuário viram AÇÕES, nunca alterações de DOM --- */
searchInput.addEventListener("input", (event) => {
  setSearchTerm(event.target.value);
});

onlyActiveInput.addEventListener("change", (event) => {
  setOnlyActive(event.target.checked);
});

/* --- Sempre que o estado mudar, a tela é redesenhada --- */
subscribe(renderApp);

/* --- Carga inicial --- */
async function start() {
  renderApp(getState());

  try {
    const patients = await listPatients();
    setPatients(patients);
  } catch (error) {
    setError(error.message);
  }
}

start();