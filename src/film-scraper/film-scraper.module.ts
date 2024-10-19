import { Module } from "@nestjs/common";
import { FilmScraperService } from "./film-scraper.service";

const filmScraperFactory = {
  provide: FilmScraperService,
  useFactory: () => {
    const adapterName = process.env.SCRAPER_ADAPTER;
    return new FilmScraperService(adapterName);
  },
};
@Module({
  providers: [filmScraperFactory],
  exports: [FilmScraperService],
})
export class FilmScraperModule {}
