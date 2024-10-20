import { Injectable } from "@nestjs/common";
import { FilmScraperService } from "./film-scraper/film-scraper.service";
import { IFilm } from "./shared/zod-schemas/FilmSchema";
import { IRecommendRequestDto } from "./shared/zod-schemas/RecommendRequestDtoSchema";

@Injectable()
export class AppService {
  constructor(private filmScraperService: FilmScraperService) {}
  async searchFilm(filmTitle: string): Promise<IFilm[]> {
    if (!filmTitle) {
      throw new Error("Film title must be provided");
    }
    try {
      const films = await this.filmScraperService.searchFilm(filmTitle);
      return films;
    } catch (error) {
      console.error(`Error searching for films: ${error.message}`);
      throw new Error("Failed to retrieve film data.");
    }
  }
  async getRecommendations(dto: IRecommendRequestDto): Promise<any> {
    const { minYear, maxYear, similarMovieUrls } = dto;
    const similarFilmsMap: Array<{ filmUrl: IFilm["url"]; similar: IFilm[] }> =
      [];
    let recommendationsOccurrences: Array<{
      recommendedFilm: IFilm;
      similarTo: Array<IFilm["url"]>;
    }> = [];
    for (const filmUrl of similarMovieUrls) {
      const similarFilms = await this.filmScraperService.similarFilms(filmUrl);
      similarFilmsMap.push({ filmUrl: filmUrl, similar: similarFilms });
    }
    for (let i = 0; i < similarFilmsMap.length; i++) {
      const { filmUrl, similar } = similarFilmsMap[i];
      while (similar.length) {
        const recommendedFilm = similar.shift()!;
        if (similarMovieUrls.includes(recommendedFilm.url)) {
          continue;
        }
        const similarTo: Array<IFilm["url"]> = [];
        similarTo.push(filmUrl);
        for (let j = i + 1; j < similarFilmsMap.length; j++) {
          const foundFilmIndex = similarFilmsMap[j].similar.findIndex(
            (entry) => entry.url === recommendedFilm.url
          );
          if (foundFilmIndex !== -1) {
            similarTo.push(similarFilmsMap[j].filmUrl);
            similarFilmsMap[j].similar.splice(foundFilmIndex, 1);
          }
        }
        recommendationsOccurrences.push({
          recommendedFilm,
          similarTo,
        });
      }
    }
    recommendationsOccurrences = recommendationsOccurrences.sort(
      (a, b) => b.similarTo.length - a.similarTo.length
    );
    recommendationsOccurrences = recommendationsOccurrences.filter(
      (recommend) => {
        if (!recommend.recommendedFilm.year) return false;
        let res = true;
        const year = parseInt(recommend.recommendedFilm.year);
        if (isNaN(year)) {
          return false;
        }
        if (minYear !== undefined && year < minYear) {
          return false;
        }
        if (maxYear !== undefined && year > maxYear) {
          return false;
        }
        return res;
      }
    );
    return recommendationsOccurrences;
  }
}
