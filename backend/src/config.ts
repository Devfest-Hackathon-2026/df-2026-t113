import { z } from "zod";
const environmentSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  HOST: z.string().min(1).default("0.0.0.0"),
});
export const config = environmentSchema.parse(process.env);
