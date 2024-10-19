import { IFilm } from "src/shared/zod-schemas/FilmSchema";
export interface IScraper {
  searchFilm(input: IFilm["title"]): Promise<IFilm[]>;
  similarFilms(film: IFilm): Promise<IFilm[]>;
  filmsByDirector(director: string): Promise<IFilm[]>;
  filmsByGenre(genre: string): Promise<IFilm[]>;
}
