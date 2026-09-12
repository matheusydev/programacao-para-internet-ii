import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().trim().min(1, "O nome não pode ser vazio"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "A data de nascimento deve estar no formato AAAA-MM-DD"),
  nationalId: z.string().trim().min(1, "O CNS é obrigatório")
});