import { registerAs } from "@nestjs/config";
import { DEFAULT_APP_ENVIRONMENT } from "src/shared/constants";

export default registerAs("app_config", () => ({
  appPort: process.env.APP_PORT! && parseInt(process.env.APP_PORT, 10) || 3000,
  appEnvironment: process.env.APP_ENVIRONMENT || DEFAULT_APP_ENVIRONMENT,
  filmScraperAdapter: process.env.SCRAPER_ADAPTER || null
}));
