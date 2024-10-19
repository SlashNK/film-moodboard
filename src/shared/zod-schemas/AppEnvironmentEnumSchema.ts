import { z } from "zod";
export const AppEnvironmentEnumSchema = z.enum(["development", "production"]);
export type IAppEnvironmentEnum = z.infer<typeof AppEnvironmentEnumSchema>;
