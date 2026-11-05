import { app } from "./app.js";
import { config } from "./config.js";
const server = app.listen(config.PORT, config.HOST, () =>
  console.info(`Contour API listening on port ${config.PORT}`),
);
function shutdown(): void {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
