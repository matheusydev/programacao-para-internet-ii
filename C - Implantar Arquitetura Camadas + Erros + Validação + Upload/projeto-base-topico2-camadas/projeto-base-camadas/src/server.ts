/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP
 * ============================================================
 * Este arquivo AINDA esta como veio da rodada 1 do Topico 2:
 * tudo em um unico arquivo, sem camadas. Ele FUNCIONA -- rode
 * `npm run dev` agora mesmo e confirme.
 *
 * O trabalho desta etapa e mover este codigo para:
 *   src/routes/       (so roteamento)
 *   src/controllers/  (traducao HTTP <-> dominio)
 *   src/services/     (regra de negocio)
 *
 * Siga os TODOs NUMERADOS em routes/, controllers/ e services/
 * primeiro (TODO 1 a TODO 7). So volte a este arquivo no TODO 7,
 * para trocar as rotas abaixo pelos routers novos.
 *
 * NAO APAGUE nada abaixo antes de ter a camada nova funcionando --
 * use este código como a fonte da verdade de "o que o endpoint
 * precisa continuar fazendo".
 * ============================================================
 */

import express from "express";
import { patientsRouter } from "./routes/patients.routes.ts";
import { encountersRouter } from "./routes/encounters.routes.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/api/patients", patientsRouter);
app.use("/api/patients/:id/encounters", encountersRouter);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});


/* ============================================================
   ------------------------------------------------------------
   TODO 9 (Encontro 2, depois de errors/ e middlewares/errorHandler.ts prontos)
   ------------------------------------------------------------
   Registre o error handler POR ULTIMO, depois de todas as rotas:

     import { errorHandler } from "./middlewares/errorHandler.ts";
     app.use(errorHandler);
   ============================================================ */
