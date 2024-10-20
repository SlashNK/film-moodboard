import { LetterboxdScrapper } from "./letterboxd-scrapper";
import { FilmSchema } from "src/shared/zod-schemas/FilmSchema";

describe("LetterboxdScrapper", () => {
  it.skip("should be defined", () => {
    expect(new LetterboxdScrapper()).toBeDefined();
  });

  describe("searchFilm()", () => {
    it("should return a list of films", async () => {
      const scraper = new LetterboxdScrapper();
      const films = await scraper.searchFilm("searchFilm() test");
      expect(films).toBeInstanceOf(Array);
      films.forEach((film) => {
        const validationResult = FilmSchema.safeParse(film);
        expect(validationResult.success).toBe(true);
        if (!validationResult.success) {
          console.error(`Invalid film data: ${validationResult.error}`);
        } else {
          console.log(`Parsed film: ${JSON.stringify(validationResult.data)}`);
        }
      });
    }, 100000);
  });
});
