import { z } from "zod";
export const FilmScraperAdapterEnumSchema = z.enum([
  "letterboxd",
]);
export type IFilmScraperAdapterEnum = z.infer<typeof FilmScraperAdapterEnumSchema>;
