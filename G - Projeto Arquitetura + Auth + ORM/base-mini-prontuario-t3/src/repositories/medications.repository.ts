/**
 * PORT de MedicationRequest — o contrato que o service enxerga.
 *
 * Mesmas decisões dos ports de Patient e Encounter: sem nenhum import,
 * métodos assíncronos (o Prisma virá atrás desta mesma interface) e
 * formato do domínio em camelCase.
 */

/** Prescrição (pedido de medicação) como o domínio (e a API) a enxerga. */
export type MedicationRequest = {
  id: number;
  encounterId: number;
  medication: string;
  dosage: string;
};

/** Dados necessários para registrar uma prescrição. */
export type NewMedicationRequest = {
  encounterId: number;
  medication: string;
  dosage: string;
};

export interface MedicationsRepository {
  /**
   * Prescrições de um atendimento, na ORDEM EM QUE FORAM FEITAS
   * (id crescente). A ordem faz parte do contrato: todo adapter
   * precisa respeitá-la.
   * Atendimento sem prescrições (ou inexistente) -> lista vazia.
   */
  findByEncounterId(encounterId: number): Promise<MedicationRequest[]>;
  create(data: NewMedicationRequest): Promise<MedicationRequest>;
}