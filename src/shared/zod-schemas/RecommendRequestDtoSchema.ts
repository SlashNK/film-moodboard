import { z } from "zod";
import { FilmSchema } from "./FilmSchema";

const RecommendRequestDtoSchema = z.object({
  minYear: z
    .number()
    .min(1900)
    .max(3000)
    .optional()
    .describe("minimum year of films"),
  maxYear: z
    .number()
    .min(1900)
    .max(3000)
    .optional()
    .describe("maximum year of films"),
  similarMovieUrls: z
    .array(FilmSchema.shape.url)
    .default([])
    .describe("list of URLs for similar movies"),
});
type IRecommendRequestDto = z.infer<typeof RecommendRequestDtoSchema>;

export { RecommendRequestDtoSchema, IRecommendRequestDto };
