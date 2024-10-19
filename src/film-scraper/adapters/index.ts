import { DEFAULT_FILM_SCRAPER_ADAPTER } from "../shared/constants";
import { IScraper } from "../shared/interfaces/IFIlmScraper";
import {
  FilmScraperAdapterEnumSchema,
  IFilmScraperAdapterEnum,
} from "../shared/zod-schemas/FilmScraperAdapterEnumSchema";
import { LetterboxdScrapper } from "./letterboxd-scrapper/letterboxd-scrapper";

const FilmScraperAdapterClassGeneratorMap: Record<
  IFilmScraperAdapterEnum,
  new () => IScraper
> = {
  letterboxd: LetterboxdScrapper,
};

export const initScraperAdapter = (adapterName: any): IScraper => {
  const parsed = FilmScraperAdapterEnumSchema.safeParse(adapterName);
  let adapterEnum: IFilmScraperAdapterEnum = DEFAULT_FILM_SCRAPER_ADAPTER;
  if (!parsed.success) {
    console.warn(
      `Invalid adapter name: ${adapterName}. Defaulting to: ${DEFAULT_FILM_SCRAPER_ADAPTER}`
    );
  } else {
    adapterEnum = parsed.data;
  }
  const AdapterClass = FilmScraperAdapterClassGeneratorMap[adapterEnum];
  return new AdapterClass();
};
