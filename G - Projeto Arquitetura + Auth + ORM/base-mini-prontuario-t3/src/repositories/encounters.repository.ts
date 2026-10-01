/**
 * PORT de Encounter — o contrato que o service enxerga.
 *
 * Mesmas decisões do port de Patient: sem nenhum import, métodos
 * assíncronos (o Prisma virá atrás desta mesma interface) e formato
 * do domínio em camelCase.
 */

/** Atendimento como o domínio (e a API) o enxerga. */
export type Encounter = {
  id: number;
  patientId: number;
  startedAt: string;
  chiefComplaint: string;
  notes: string | null;
};

/** Dados necessários para registrar um atendimento. */
export type NewEncounter = {
  patientId: number;
  startedAt: string;
  chiefComplaint: string;
  /** Explícito: `null` quando não há conduta. Quem chama decide isso. */
  notes: string | null;
};

export interface EncountersRepository {
  /**
   * Atendimentos de um paciente, do MAIS RECENTE para o mais antigo
   * (startedAt decrescente). A ordem faz parte do contrato: todo
   * adapter precisa respeitá-la.
   * Paciente sem atendimentos (ou inexistente) -> lista vazia.
   */
  findByPatientId(patientId: number): Promise<Encounter[]>;
  /** Devolve null quando não existe — decidir se isso é 404 é papel do service. */
  findById(id: number): Promise<Encounter | null>;
  create(data: NewEncounter): Promise<Encounter>;
}