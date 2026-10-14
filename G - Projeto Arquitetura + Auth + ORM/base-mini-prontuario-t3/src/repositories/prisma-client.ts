/**
 * Conexão única com o banco via Prisma Client.
 *
 * Mora DENTRO de repositories/ de propósito: a regra
 * so-repositories-importam-o-driver (ARQ-6) proíbe qualquer arquivo
 * fora desta pasta de importar @prisma. Os adapters Prisma importam
 * daqui; o resto do sistema nem sabe que o Prisma existe.
 *
 * O endereço do banco vem do DATABASE_URL do .env (invariante OP2),
 * resolvido a partir de prisma/schema.prisma.
 */
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
