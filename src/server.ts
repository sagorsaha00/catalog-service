import config from "config";
import app from "./app";
import { initDb } from "./config/db";
import logger from "./logger";

const startserver = async () => {
  const PORT = config.get("server.port") || 5502;
  

  try {
    await initDb();
    app.listen(PORT, () => {
      logger.info(`surver is runing ${PORT}`);
      logger.info("databse connect successfully");
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startserver();
