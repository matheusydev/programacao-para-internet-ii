/**
 * Seed do banco: insere os dados de teste depois que as migrations
 * recriam as tabelas. Executado automaticamente pelo
 * `prisma migrate reset` (e, portanto, pelo `npm run db:reset`).
 *
 * Reaproveita o database/seed.sql: os dados fictícios continuam num
 * lugar só. Este arquivo fica em scripts/ (e não em src/) porque é
 * ferramenta de desenvolvimento, e não parte da aplicação.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const file = readFileSync(join(process.cwd(), "database", "seed.sql"), "utf8");

  // O Prisma executa UM comando SQL por chamada. Tiramos as linhas de
  // comentário e separamos os comandos pelo ";".
  const statements = file
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

  for (const statement of statements) {
    // "Unsafe" porque o SQL não passa por parâmetros. Aqui é seguro: o
    // conteúdo vem de um arquivo nosso, nunca de entrada do usuário.
    await prisma.$executeRawUnsafe(statement);
  }

  const total = await prisma.patient.count();
  console.log(`Pacientes inseridos: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
  