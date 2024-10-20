import { Browser, chromium, Page } from "playwright";
import { IScraper } from "src/film-scraper/shared/interfaces/IFIlmScraper";
import { toKebabCase } from "src/film-scraper/shared/utils";
import { FilmSchema, IFilm } from "src/shared/zod-schemas/FilmSchema";

export class LetterboxdScrapper implements IScraper {
  LETTERBOXD_URL_PREFIX = "https://letterboxd.com";
  SEARCH_FILM_URL_ROUTE = "search/films";
  SIMILAR_FILM_URL_ROUTE = "similar";
  DIRECTOR_URL_ROUTE = "director";
  constructor() {}
  _browser: Browser | null = null;
  _page: Page | null = null;

  async getBrowser(): Promise<Browser> {
    if (this._browser == null) {
      this._browser = await chromium.launch();
    }
    return this._browser;
  }

  async getPage(): Promise<Page> {
    if (this._page == null) {
      this._page = await (await this.getBrowser()).newPage();
    }
    return this._page;
  }

  async closePage() {
    if (this._page != null) {
      await this._page.close();
    }
    this._page = null;
  }

  async closeBrowser() {
    await this.closePage();
    if (this._browser != null) {
      await this._browser.close();
    }
    this._browser = null;
  }

  joinUrlPath(path: string[]): string {
    const cleanedRelPath = path.map((elm) => elm.replace(/^\/+|\/+$/g, ""));
    return cleanedRelPath.join("/");
  }

  getAbsoluteUrl(relPath: string[]): string {
    const absolutePath = [
      this.LETTERBOXD_URL_PREFIX,
      this.joinUrlPath(relPath),
    ].join("/");
    return absolutePath;
  }

  async searchFilm(input: IFilm["title"]): Promise<IFilm[]> {
    if (input == null) {
      return [];
    }
    const page = await this.getPage();
    await page.goto(this.getAbsoluteUrl([this.SEARCH_FILM_URL_ROUTE, input]), {
      waitUntil: "networkidle",
    });
    const hasResults = await page.$(".results");
    if (!hasResults) {
      return [];
    }
    await page.waitForSelector(".results");
    const films = await page.$$eval(".results li", (listItems) => {
      return listItems.map((element) => {
        const title =
          element.querySelector(".film-title-wrapper a")?.textContent?.trim() ||
          null;
        const url =
          element
            .querySelector(".film-title-wrapper a")
            ?.getAttribute("href") || null;
        const year =
          element.querySelector(".metadata a")?.textContent?.trim() || null;
        const directors = Array.from(
          element.querySelectorAll(".film-metadata a.text-slug")
        ).map((directorElement) => directorElement.textContent?.trim());
        return {
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
      });
    });
    const parsedFilms: IFilm[] = [];
    for (const film of films) {
      if (!film.url) {
        console.error(`Invalid film URL: ${film.url}`);
        continue;
      }
      film.url = this.getAbsoluteUrl([film.url]);
      const validationResult = FilmSchema.safeParse(film);
      if (validationResult.success) {
        parsedFilms.push(validationResult.data);
      } else {
        console.error(`Invalid film data: ${validationResult.error}`);
      }
    }
    return parsedFilms;
  }

  async similarFilms(filmUrl: IFilm["url"]): Promise<IFilm[]> {
    const page = await this.getPage();
    const similarFilms: IFilm[] = [];
    const url = this.joinUrlPath([filmUrl, this.SIMILAR_FILM_URL_ROUTE]);
    try {
      await page.goto(url);
      const filmElements = await page.$$(".poster-container .poster");
      for (const filmElement of filmElements) {
        const filmName = await filmElement.getAttribute("data-film-name");
        const filmRelPath = await filmElement.getAttribute("data-film-slug");
        const releaseYear = await filmElement.getAttribute(
          "data-film-release-year"
        );
        if (!filmRelPath) {
          console.error(`Invalid film URL: ${filmRelPath}`);
          continue;
        }
        similarFilms.push({
          title: filmName || null,
          url: this.getAbsoluteUrl([filmRelPath]),
          year: releaseYear || null,
          directors: [],
          description: null,
          runtime: null,
          genres: [],
          countries: [],
          languages: [],
        });
      }
    } catch (error) {
      console.error(`Error fetching similar films: ${error.message}`);
    }
    return similarFilms;
  }

  async filmsByDirector(director: string): Promise<IFilm[]> {
    const page = await this.getPage();
    const filmsByDirector: IFilm[] = [];
    const directorKebab = toKebabCase(director);
    const url = this.getAbsoluteUrl([this.DIRECTOR_URL_ROUTE, directorKebab]);
    try {
      await page.goto(url);
      const filmElements = await page.$$(".poster-container .poster");
      for (const filmElement of filmElements) {
        const filmName = await filmElement.getAttribute("data-film-name");
        const filmRelPath = await filmElement.getAttribute("data-film-slug");
        const releaseYear = await filmElement.getAttribute(
          "data-film-release-year"
        );
        if (!filmRelPath) {
          console.error(`Invalid film URL: ${filmRelPath}`);
          continue;
        }
        filmsByDirector.push({
          title: filmName || null,
          url: this.getAbsoluteUrl([filmRelPath]),
          year: releaseYear || null,
          directors: [director],
          description: null,
          runtime: null,
          genres: [],
          countries: [],
          languages: [],
        });
      }
    } catch (error) {
      console.error(`Error fetching similar films: ${error.message}`);
    }
    return filmsByDirector;
  }
  async getFilmByUrl(filmUrl: IFilm["url"]): Promise<IFilm> {
    const page = await this.getPage();
    try {
      await page.goto(filmUrl);
      const title: string | null =
        (await page.$eval("h1.headline-1.filmtitle .name", (el) =>
          el.textContent?.trim()
        )) || null;

      // Extract the year
      const year = await page.$eval("div.releaseyear a", (el) =>
        el.textContent?.trim()
      );

      // Extract the director
      const director = await page.$eval(
        "p.credits .directorlist a.contributor",
        (el) => el.textContent?.trim()
      );

      // Extract the description
      const description = await page.$eval(
        "div.review.body-text.-prose.-hero.prettify .truncate p",
        (el) => el.textContent?.trim()
      );

      // Extract the runtime (in minutes)
      const runtimeText = await page.$eval("p.text-link.text-footer", (el) =>
        el.textContent?.trim()
      );
      const runtimeMatch = runtimeText?.match(/(\d+)\s*mins/);
      const runtime = runtimeMatch ? parseInt(runtimeMatch[1], 10) : null;
      const film: IFilm = {
        title: title,
        url: filmUrl,
        year: year || null,
        directors: director ? [director] : [],
        description: description || null,
        runtime: runtime,
        genres: [],
        countries: [],
        languages: [],
      };
      return film;
    } catch (error) {
      console.error(`Error fetching similar films: ${error.message}`);
    }
    return {
      url: filmUrl,
      countries: [],
      directors: [],
      description: null,
      genres: [],
      languages: [],
      runtime: null,
      title: null,
      year: null,
    };
  }
}
