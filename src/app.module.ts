import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FilmScraperModule } from "./film-scraper/film-scraper.module";
import appConfig from "./config/app.config";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    FilmScraperModule,
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
