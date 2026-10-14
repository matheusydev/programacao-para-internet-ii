/**
 * ADAPTER Prisma de Patient — irmão gêmeo do SqlitePatientsRepository.
 *
 * Cumpre o MESMO port (PatientsRepository). É a prova da trilha ORM:
 * se o gate continuar verde depois da troca no app.ts, o service não
 * percebeu que o banco passou a ser acessado pelo Prisma.
 */
import type { Patient as PatientRecord } from "@prisma/client";
import { prisma } from "./prisma-client";
import type { NewPatient, Patient, PatientsRepository } from "./patients.repository";

/**
 * Tradução registro do Prisma -> domínio.
 * Os nomes já chegam em camelCase (o @map do ORM-3 fez esse trabalho);
 * sobra o `active`, que o banco guarda como 0/1.
 * Campo a campo, de propósito: se o banco ganhar uma coluna nova, ela
 * não vaza para a resposta da API sem alguém decidir.
 */
function toPatient(record: PatientRecord): Patient {
  return {
    id: record.id,
    name: record.name,
    birthDate: record.birthDate,
    nationalId: record.nationalId,
    photoUrl: record.photoUrl,
    active: record.active === 1,
  };
}

export class PrismaPatientsRepository implements PatientsRepository {
  async findAll(): Promise<Patient[]> {
    const records = await prisma.patient.findMany({ orderBy: { name: "asc" } });
    return records.map(toPatient);
  }

  async findById(id: number): Promise<Patient | null> {
    // Um id que não é inteiro (ex.: /api/patients/abc vira NaN) não
    // existe. O better-sqlite3 tratava NaN como "não encontrado" (404);
    // o Prisma recusaria o valor com um erro de validação (500).
    // Esta linha preserva o comportamento observável.
    if (!Number.isInteger(id)) return null;

    const record = await prisma.patient.findUnique({ where: { id } });
    return record ? toPatient(record) : null;
  }

  async findByNationalId(nationalId: string): Promise<Patient | null> {
    // nationalId é @unique no schema, por isso findUnique serve aqui.
    const record = await prisma.patient.findUnique({ where: { nationalId } });
    return record ? toPatient(record) : null;
  }

  async create(data: NewPatient): Promise<Patient> {
    // O Prisma já devolve o registro completo, com o id gerado e o
    // active = 1 do @default: não é preciso reler a linha.
    const record = await prisma.patient.create({
      data: {
        name: data.name,
        birthDate: data.birthDate,
        nationalId: data.nationalId,
      },
    });
    return toPatient(record);
  }

  async updatePhoto(id: number, photoUrl: string): Promise<void> {
    // updateMany, e não update: um UPDATE em id inexistente não faz
    // nada (como no adapter SQLite), em vez de lançar erro. Quem garante
    // o 404 antes de gravar é o service.
    await prisma.patient.updateMany({ where: { id }, data: { photoUrl } });
  }
}
