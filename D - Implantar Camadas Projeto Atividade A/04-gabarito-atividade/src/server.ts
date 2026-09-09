/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP  [SOLUCAO DO ENCONTRO 2]
 * ============================================================
 * Um arquivo so, sem camadas, sem arquitetura. E proposital.
 * O objetivo desta semana e enxergar o HTTP acontecendo.
 * A separacao em camadas chega na Semana 03.
 */
import express from "express";
import { patientsRouter } from "./routes/patients.routes";
import { encountersRouter } from "./routes/encounters.routes";

const app = express();
const PORT = 3000;

/* ------------------------------------------------------------
   MIDDLEWARES - rodam antes das rotas, na ordem em que aparecem
   ------------------------------------------------------------ */

// Sem esta linha, req.body vem `undefined`.
app.use(express.json());

// Frontend e API na MESMA origem -> nao precisamos falar de CORS ainda.
app.use(express.static("public"));

app.use("/api/patients", patientsRouter);
app.use("/api/patients/:id/encounters", encountersRouter);

/* ------------------------------------------------------------
   TIPOS E TRADUCAO ENTRE BANCO E JSON
   ------------------------------------------------------------
   O banco fala snake_case e nao tem boolean.
   A API fala camelCase e tem boolean.
   Alguem precisa traduzir. Por enquanto, esta funcao.
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   VALIDACAO
   ------------------------------------------------------------
   Validar e responder a uma pergunta: "da para confiar nisso?"
   Devolvemos a PRIMEIRA falha encontrada, com mensagem util.
   Mensagem util e a que diz o que fazer, nao so o que houve.
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   ROTAS
   ------------------------------------------------------------ */

/** Saude do servico. */
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});


/* ============================================================
   ENCOUNTERS - atendimentos de um paciente
   ============================================================ */

/* ------------------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});