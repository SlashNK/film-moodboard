import { IScraper } from "src/film-scraper/shared/interfaces/IFIlmScraper";
import { IFilm } from "src/shared/zod-schemas/FilmSchema";

export class LetterboxdScrapper implements IScraper {
  searchFilm(input: IFilm["title"]): Promise<IFilm[]> {
    throw new Error("Method not implemented.");
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
