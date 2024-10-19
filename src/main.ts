import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { AppEnvironmentEnumSchema } from "./shared/zod-schemas/AppEnvironmentEnumSchema";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("app_config.appPort");
  const appEnvironment = configService.get<string>("app_config.appEnvironment");
  if (appEnvironment === AppEnvironmentEnumSchema.Enum.development) {
    console.debug(`Application running in ${appEnvironment} mode`);
    console.debug("App config:");
    console.debug(
      JSON.stringify(configService.get<any>("app_config"), null, 2)
    );
  }
  await app.listen(3000);
}
bootstrap();
