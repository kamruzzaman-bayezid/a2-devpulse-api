import app from "./app";
import config from "./config/env";
import initDb from "./db";

const main = async () => {
  try {
    // Initialize Database
    await initDb();

    app.listen(config.port, () => {
      console.log(`DevPulse app listening on port ${config.port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
