/**
 * ============================================================
 * TODO 2 -- Controller de Patient
 * ============================================================
 * O controller traduz HTTP <-> dominio. Ele:
 *   - le req.params / req.body
 *   - chama o Service (que ainda nao existe -- e o TODO 3)
 *   - formata a resposta (res.status().json())
 *
 * O controller NUNCA:
 *   - chama db.prepare diretamente
 *   - contem "if" de regra de negocio (ex.: "CNS ja existe?")
 *
 * Migre a LOGICA DE TRADUCAO HTTP das 3 rotas de patients que
 * estao em server.ts (list, getById, create) para ca. A
 * validacao de formato e a checagem de duplicidade vao para o
 * Service, no TODO 3.
 *
 * Dica de assinatura:
 *   import { patientsService } from "../services/patients.service.ts";
 *
 *   export const patientsController = {
 *     list(req, res) { ... },
 *     getById(req, res) { ... },
 *     create(req, res) { ... },
 *   };
 * ============================================================
 */
import { Request, Response } from "express";
import { patientsService } from "../services/patients.service.ts";

export const patientsController = {
  list(_req: Request, res: Response) {
    const patients = patientsService.list();
    res.status(200).json(patients);
  },

  getById(req: Request, res: Response) {
    const patient = patientsService.getById(req.params.id as string);
    
    if (!patient) {
      res.status(404).json({ error: "Paciente nao encontrado." });
      return;
    }
    
    res.status(200).json(patient);
  },

  create(req: Request, res: Response) {
    try {
      const { name, birthDate, nationalId } = req.body;
      const created = patientsService.create({ name, birthDate, nationalId });
      
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "VALIDATION_FAILED") {
          res.status(400).json({ error: "Erro de validacao nos campos." });
          return;
        }
        
        if (error.message === "DUPLICATE_CNS") {
          res.status(409).json({ error: "Ja existe um paciente com este CNS." });
          return;
        }
      }
      
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};
/**
 * ============================================================
 * TODO 13 (Encontro 2, continuacao) -- Controller de upload
 * ============================================================
 * uploadPhoto(req, res):
 *   - se !req.file -> throw new UnprocessableEntityError()
 *   - chama patientsService.setPhoto(req.params.id, req.file.filename)
 *   - responde 200 com o paciente atualizado
 * ============================================================
 */
