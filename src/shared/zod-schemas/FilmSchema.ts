import { z } from 'zod';

const FilmSchema = z.object({
  title: z.string().describe('fim title'),
  url: z.string().url().describe('film url'), 
  year: z.string().nullable().default(null).describe('test'), 
  directors: z.array(z.string()).default([]).describe('list of film directors'), 
  description: z.string().describe('film synopsis'),
  runtime: z.number().nullable().default(null).describe('film runtime in minutes'), 
  genres: z.array(z.string()).default([]).describe('list of film genres'), 
  countries: z.array(z.string()).default([]).describe('list of countries'), 
  languages: z.array(z.string()).default([]).describe('list of languages'), 
});
type IFilm = z.infer<typeof FilmSchema>;
export { FilmSchema, IFilm };
