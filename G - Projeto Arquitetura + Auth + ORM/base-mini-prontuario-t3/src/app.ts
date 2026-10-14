/**
 * ============================================================
 * Montagem da aplicação — SEM subir servidor.
 * ------------------------------------------------------------
 * Separar `app` (a máquina) de `listen` (ligar a máquina) é o
 * que torna o servidor TESTÁVEL: os testes importam o app e o
 * sobem numa porta efêmera, sem tocar a porta 3000.
 * ============================================================
 */
import express from "express";
import { patientsRouter } from "./routes/patients.routes";
import { encountersRouter } from "./routes/encounters.routes";
import { medicationsRouter } from "./routes/medications.routes";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { configurePatientsRepository } from "./services/patients.service";
import { configureEncountersRepository } from "./services/encounters.service";
import { configureMedicationsRepository } from "./services/medications.service";
import { PrismaPatientsRepository } from "./repositories/prisma-patients.repository";
import { PrismaEncountersRepository } from "./repositories/prisma-encounters.repository";
import { PrismaMedicationsRepository } from "./repositories/prisma-medications.repository";

/* Montagem das dependências (composition root): o ÚNICO lugar que
   escolhe qual adapter cada service usa. ORM-4: a troca de SQLite
   para Prisma aconteceu aqui — e em nenhum service. */
configurePatientsRepository(new PrismaPatientsRepository());
configureEncountersRepository(new PrismaEncountersRepository());
configureMedicationsRepository(new PrismaMedicationsRepository());

export const app = express();

/* Middlewares globais — rodam antes das rotas, na ordem em que aparecem */
app.use(express.json());
app.use(express.static("public"));
// As fotos enviadas ficam públicas em /uploads/<nome-gerado>.
app.use("/uploads", express.static("uploads"));

/* Saúde do serviço */
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

/* Recursos */
app.use("/api/auth", authRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/patients/:id/encounters", encountersRouter);
app.use("/api/encounters/:encounterId/medications", medicationsRouter);

/* O tratador de erros entra POR ÚLTIMO — depois de todas as rotas.
   Registrado antes, ele nunca vê os erros que nascem depois dele. */
app.use(errorHandler);
