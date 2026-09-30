/**
 * PORT de Patient — o contrato que o service enxerga.
 *
 * Este arquivo NÃO importa banco nenhum. É isso que permite trocar
 * o adapter (SQLite hoje, Prisma na trilha ORM, InMemory no N3)
 * sem que o service perceba.
 *
 * Decisões:
 * - Os métodos devolvem Promise desde já: o Prisma é assíncrono, e
 *   a trilha ORM exige a MESMA interface. Síncrono agora = interface
 *   quebrada depois.
 * - O port fala camelCase (o formato do domínio). snake_case é
 *   detalhe do banco e fica preso dentro do adapter.
 */

/** Paciente como o domínio (e a API) o enxerga. */
export type Patient = {
  id: number;
  name: string;
  birthDate: string;
  nationalId: string;
  photoUrl: string | null;
  active: boolean;
};

/** Dados necessários para criar um paciente. */
export type NewPatient = {
  name: string;
  birthDate: string;
  nationalId: string;
};

export interface PatientsRepository {
  findAll(): Promise<Patient[]>;
  /** Devolve null quando não existe — decidir se isso é 404 é papel do service. */
  findById(id: number): Promise<Patient | null>;
  findByNationalId(nationalId: string): Promise<Patient | null>;
  create(data: NewPatient): Promise<Patient>;
  updatePhoto(id: number, photoUrl: string): Promise<void>;
}