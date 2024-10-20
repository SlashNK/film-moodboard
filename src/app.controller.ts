import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { IFilm } from "./shared/zod-schemas/FilmSchema";
import {
  IRecommendRequestDto,
  RecommendRequestDtoSchema,
} from "./shared/zod-schemas/RecommendRequestDtoSchema";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get("search/:film")
  async searchFilm(@Param("film") film: string): Promise<IFilm[]> {
    try {
      const films = await this.appService.searchFilm(film);
      if (films.length === 0) {
        throw new HttpException("No films found", HttpStatus.NOT_FOUND);
      }
      return films;
    } catch (error) {
      console.error(`Error fetching film search results: ${error.message}`);
      throw new HttpException(
        "Failed to fetch film data",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Post("recommend")
  async recommend(@Body() body: unknown): Promise<IFilm[]> {
    try {
      const dto: IRecommendRequestDto = RecommendRequestDtoSchema.parse(body);
      const films = await this.appService.getRecommendations(dto);
      return films;
    } catch (error) {
      console.error(`Error processing recommendation: ${error.message}`);
      throw new HttpException(
        "Failed to process recommendation",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
