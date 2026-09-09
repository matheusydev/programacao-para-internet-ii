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
    const encounters = encountersService.list(req.params.id as string);
    res.status(200).json(encounters);
  },

  create(req: Request, res: Response) {
    const { startedAt, chiefComplaint, notes } = req.body ?? {};

    const created = encountersService.create(req.params.id as string, { 
      startedAt, 
      chiefComplaint, 
      notes 
    });
      
    res.status(201).json(created); 
  },
};