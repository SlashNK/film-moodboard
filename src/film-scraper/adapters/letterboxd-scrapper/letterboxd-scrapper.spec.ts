import { toKebabCase } from "src/film-scraper/shared/utils";
import { LetterboxdScrapper } from "./letterboxd-scrapper";
import { FilmSchema } from "src/shared/zod-schemas/FilmSchema";

describe("LetterboxdScrapper", () => {
  let scraper: LetterboxdScrapper;

  beforeAll(async () => {
    scraper = new LetterboxdScrapper();
    await scraper.getBrowser();
  });

  afterAll(async () => {
    await scraper.closeBrowser();
  });

  it("should be defined", () => {
    expect(scraper).toBeDefined();
  });

  describe.skip("searchFilm()", () => {
    it("should return a list of films", async () => {
      const films = await scraper.searchFilm("jest");
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

  describe("similarFilms()", () => {
    it("should return a list of similar films", async () => {
      const filmUrl = "https://letterboxd.com/film/devs/";
      const similarFilms = await scraper.similarFilms(filmUrl);
      expect(similarFilms).toBeInstanceOf(Array);
      similarFilms.forEach((film) => {
        const validationResult = FilmSchema.safeParse(film);
        expect(validationResult.success).toBe(true);
        if (!validationResult.success) {
          console.error(`Invalid similar film data: ${validationResult.error}`);
        } else {
          console.log(
            `Parsed similar film: ${JSON.stringify(validationResult.data)}`
          );
        }
      });
    }, 100000);
  });
  describe.only("filmsByDirector()", () => {
    it("should return a list of films by director", async () => {
      const director = "Alex Garland";
      const directorFilms = await scraper.filmsByDirector(director);
      expect(directorFilms).toBeInstanceOf(Array);
      directorFilms.forEach((film) => {
        const validationResult = FilmSchema.safeParse(film);
        expect(validationResult.success).toBe(true);
        if (!validationResult.success) {
          console.error(`Invalid similar film data: ${validationResult.error}`);
        } else {
          console.log(
            `Parsed similar film: ${JSON.stringify(validationResult.data)}`
          );
        }
      });
    }, 100000);
  });
});
