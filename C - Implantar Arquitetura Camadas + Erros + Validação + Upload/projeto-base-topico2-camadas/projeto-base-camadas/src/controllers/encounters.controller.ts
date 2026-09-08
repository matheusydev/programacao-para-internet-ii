/**
 * ============================================================
 * TODO 5 -- Controller de Encounter
 * ============================================================
 * Mesma regra do TODO 2: traduz HTTP <-> dominio, chama o
 * Service (TODO 6), nunca acessa o banco diretamente.
 *
 * Repare que aqui o id do paciente vem de req.params.id (por
 * causa do mergeParams no TODO 4) -- e nao de um :patientId
 * separado.
 *
 *   import { encountersService } from "../services/encounters.service.ts";
 *
 *   export const encountersController = {
 *     list(req, res) { ... },
 *     create(req, res) { ... },
 *   };
 * ============================================================
 */

import { Request, Response } from "express";
import { encountersService } from "../services/encounters.service.ts";

export const encountersController = {
  list(req: Request, res: Response) {
    try {
      const encounters = encountersService.list(req.params.id);
      res.status(200).json(encounters);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "PATIENT_NOT_FOUND") {
          res.status(404).json({ error: "Paciente nao encontrado." });
          return;
        }
      }
      
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  create(req: Request, res: Response) {
    try {
      const { startedAt, chiefComplaint, notes } = req.body ?? {};
      
      const created = encountersService.create(req.params.id, { 
        startedAt, 
        chiefComplaint, 
        notes 
      });
      
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "PATIENT_NOT_FOUND") {
          res.status(404).json({ error: "Paciente nao encontrado." });
          return;
        }
        
        if (error.message === "VALIDATION_FAILED") {
          res.status(400).json({ error: "Erro de validacao nos campos." });
          return;
        }
      }
      
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};