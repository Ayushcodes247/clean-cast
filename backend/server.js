const { error } = require("console");
const app = require("./app");
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const socketIO = require("socket.io");
const io = socketIO(server);

server.listen(PORT, () => {
  console.log(`Server is running on PORT NO.: ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `[${new Date().toISOString}] Unhandled Rejection at:`,
    promise,
    "reason:",
    reason
  );
});

process.on("uncaughtException", (error) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
  process.exit(1);
});

const gracefulShutdown = () => {
  console.log(
    `[${new Date().toISOString()}] Received ${signal}. Closing server gracefully...`
  );
  server.close(() => {
    console.log(
      `[${new Date().toISOString()}] Server closed. Exiting process.`
    );
    process.exit(0);
  });

  // Force exit if server hangs after 30s
  setTimeout(() => {
    console.error(
      `[${new Date().toISOString()}] Forcefully exiting process due to timeout.`
    );
    process.exit(1);
  }, 30_000).unref();
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
