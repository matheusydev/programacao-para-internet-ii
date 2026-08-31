const state = {
    medications: [],
    isLoading: true,
    errorMessage: null,
    selectedId: null,
    isLoadingDetail: false,
    detailErrorMessage: null,
};

const listeners = [];

export function subscribe(listener) {
    listeners.push(listener);
}

function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
}

export function getState() {
    return {
        ...state,
        selectedMedication: getSelectedMedication(),
    };
}

/**
 * Derivado: o registro aberto no painel de detalhe
 * (nunca guardado duas vezes).
 */
export function getSelectedMedication() {
    if (state.selectedId === null) {
      return null;
    }

    return state.medications.find(
        (m) => m.id === state.selectedId
    ) ?? null;
}

// PASSO 2
export function setMedications(medications) {
    state.medications = medications;
    state.isLoading = false;
    state.errorMessage = null;
    notify();
}

/**
 * Registra uma falha de carregamento da lista.
 */
export function setError(message) {
    state.errorMessage = message;
    state.isLoading = false;
    notify();
}

// PASSO 3
export function addMedication(medication) {
    state.medications = [...state.medications, medication];
    notify();
}

// PASSO 4
export function selectMedication(id) {
    state.selectedId = id;
    state.detailErrorMessage = null;
    notify();
}

export function clearSelection() {
    state.selectedId = null;
    notify();
}

/**
 * Registra uma falha ao buscar o detalhe.
 */
export function setDetailError(message) {
    state.detailErrorMessage = message;
    state.isLoadingDetail = false;
    notify();
}

// PASSO 5
export function removeMedicationFromState(id) {
    state.medications = state.medications.filter(
        (medication) => medication.id !== id
    );

    state.selectedId = null;
    notify();
}