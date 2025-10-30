import z from "zod";

export const RenterDocumentSchema = z
  .object({
    citizenshipFront: z.string(),
    citizenshipBack: z.string(),
  })
  .optional();
