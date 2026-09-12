/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP
 * ============================================================
 */
import express from "express";
import { patientsRouter } from "./routes/patients.routes";
import { encountersRouter } from "./routes/encounters.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = 3000;

/* ------------------------------------------------------------
   MIDDLEWARES - rodam antes das rotas, na ordem em que aparecem
   ------------------------------------------------------------ */

// Sem esta linha, req.body vem `undefined`.
app.use(express.json());

// Frontend e API na MESMA origem -> nao precisamos falar de CORS ainda.
app.use(express.static("public"));

/* ------------------------------------------------------------
   ROTAS
   ------------------------------------------------------------ */
app.use("/api/patients", patientsRouter);
app.use("/api/patients/:id/encounters", encountersRouter);

/** Saude do servico. */
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

/* ------------------------------------------------------------
   TRATAMENTO DE ERROS (Sempre depois das rotas!)
   ------------------------------------------------------------ */
app.use(errorHandler);

/* ------------------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});