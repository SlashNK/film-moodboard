import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FilmScraperModule } from "./film-scraper/film-scraper.module";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [FilmScraperModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
});
