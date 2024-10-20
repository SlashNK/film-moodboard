import { Injectable } from "@nestjs/common";
import { IFilm } from "src/shared/zod-schemas/FilmSchema";
import { initScraperAdapter } from "./adapters";
import { IScraper } from "./shared/interfaces/IFIlmScraper";

@Injectable()
export class FilmScraperService implements IScraper {
  private adapter: IScraper;

  constructor(adapterName: any) {
    const initializedAdapter = initScraperAdapter(adapterName);

    if (!initializedAdapter) {
      throw new Error(`No adapter found for: ${adapterName}`);
    }

    this.adapter = initializedAdapter;
  }

  searchFilm(input: IFilm["title"]): Promise<IFilm[]> {
    return this.adapter.searchFilm(input);
  }

  similarFilms(filmUrl: IFilm["url"]): Promise<IFilm[]> {
    return this.adapter.similarFilms(filmUrl);
  }

  filmsByDirector(director: string): Promise<IFilm[]> {
    return this.adapter.filmsByDirector(director);
  }
  getFilmByUrl(filmUrl: IFilm["url"]): Promise<IFilm> {
    return this.adapter.getFilmByUrl(filmUrl);
  }
}
