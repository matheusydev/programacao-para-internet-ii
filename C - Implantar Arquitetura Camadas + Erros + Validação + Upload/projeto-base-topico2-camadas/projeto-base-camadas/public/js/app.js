/**
 * Orquestracao -- PRONTA. Liga os elementos do DOM as acoes de
 * estado + api. Nenhuma logica de negocio mora aqui.
 */
import { listPatients, createPatient } from "./api.js";
import { state, setPatients, addPatient, setFormError, clearFormError, setPreviewUrl } from "./state.js";
import { render } from "./render.js";
import { renderApiError } from "./errors.js";

async function init() {
  try {
    const patients = await listPatients();
    setPatients(patients);
  } catch (err) {
    setFormError(err.message ?? "Falha ao carregar pacientes.");
  }
  render();
}

document.getElementById("patient-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormError();

  const form = event.target;
  const payload = {
    name: form.name.value,
    birthDate: form.birthDate.value,
    nationalId: form.nationalId.value,
  };

  try {
    const created = await createPatient(payload);
    addPatient(created);
    form.reset();
  } catch (err) {
    // TODO 14 (Encontro 2): trocar por renderApiError(err.apiError)
    // quando o contrato de erro { error: { message, ... } } estiver pronto.
    renderApiError(err.apiError ?? { error: { message: "Falha ao cadastrar paciente." } });
  }
  render();
});

document.querySelector('#patient-form input[name="photo"]').addEventListener("change", (event) => {
  const photo = event.target.files[0];
  if (!photo) return;
  
  const url = URL.createObjectURL(photo);
  setPreviewUrl(url);

  render();
});

init();