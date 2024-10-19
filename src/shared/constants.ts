import { AppEnvironmentEnumSchema } from "./zod-schemas/AppEnvironmentEnumSchema";

export const DEFAULT_APP_PORT = 3000;
export const DEFAULT_APP_ENVIRONMENT =
  AppEnvironmentEnumSchema.enum.development;
