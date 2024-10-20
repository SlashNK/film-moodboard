import { chromium } from "playwright";
import { IScraper } from "src/film-scraper/shared/interfaces/IFIlmScraper";
import { FilmSchema, IFilm } from "src/shared/zod-schemas/FilmSchema";

export class LetterboxdScrapper implements IScraper {
  LETTERBOXD_URL_PREFIX = "https://letterboxd.com";

  getSearchFilmUrl(input: IFilm["title"]): string {
    return [
      this.LETTERBOXD_URL_PREFIX,
      "search",
      "films",
      encodeURIComponent(input),
    ].join("/");
  }

  getAbsoluteUrl(filmRelUrl: IFilm["title"]): string {
    return [this.LETTERBOXD_URL_PREFIX, "film", filmRelUrl].join("/");
  }

  async searchFilm(input: IFilm["title"]): Promise<IFilm[]> {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(this.getSearchFilmUrl(input));

    const hasResults = await page.$(".results");

    if (!hasResults) {
      await browser.close();
      return [];
    }

    await page.waitForSelector(".results");
    const films = await page.$$eval(".results li", (listItems) => {
      return listItems.map((element) => {
        const title = element
          .querySelector(".film-title-wrapper a")
          ?.textContent?.trim();
        const url =
          element
            .querySelector(".film-title-wrapper a")
            ?.getAttribute("href") || "404";
        const year =
          element.querySelector(".metadata a")?.textContent?.trim() || null;
        const directors = Array.from(
          element.querySelectorAll(".film-metadata a.text-slug")
        ).map((directorElement) => directorElement.textContent?.trim());
        const film = {
          title,
          url,
          year,
          directors,
          description: null,
          runtime: null,
          genres: [],
          countries: [],
          languages: [],
        };
        return film;
      });
    });

    await browser.close();

    // Parse and validate films
    const parsedFilms: IFilm[] = [];
    for (const film of films) {
      film.url = this.getAbsoluteUrl(film.url);
      const validationResult = FilmSchema.safeParse(film);
      if (validationResult.success) {
        parsedFilms.push(validationResult.data);
      } else {
        console.error(`Invalid film data: ${validationResult.error}`);
      }
    }
    return parsedFilms;
  }

  similarFilms(film: IFilm): Promise<IFilm[]> {
    throw new Error("Method not implemented.");
  }

  filmsByDirector(director: string): Promise<IFilm[]> {
    throw new Error("Method not implemented.");
  }

  filmsByGenre(genre: string): Promise<IFilm[]> {
    throw new Error("Method not implemented.");
  }
}
