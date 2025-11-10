const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.info(
    `[${new Date().toISOString()}] CleanCast server is running on port ${PORT}`
  );
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `[${new Date().toISOString()}] Unhandled Rejection at:`,
    promise,
    "reason:",
    reason
  );
});

process.on("uncaughtException", (error) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
  process.exit(1);
});

const gracefulShutdown = (signal) => {
  console.log(
    `[${new Date().toISOString()}] Received ${signal}. Closing server gracefully...`
  );
  server.close(() => {
    console.log(
      `[${new Date().toISOString()}] Server closed. Exiting process.`
    );
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      `[${new Date().toISOString()}] Forcefully exiting process due to timeout.`
    );
    process.exit(1);
  }, 30_000).unref();
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
