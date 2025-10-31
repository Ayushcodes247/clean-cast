// tests/sessionStoreConfig.test.js
const mongoDBStore = require("connect-mongo");

// Mock connect-mongo to avoid real DB connection
jest.mock("connect-mongo", () => ({
  create: jest.fn(() => ({
    mongoUrl: "mock-url",
    collectionName: "sessions",
    ttl: 86400,
  })),
}));

describe("Session Store Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve("../configs/DB/sessionStorage.config")];
  });

  test("should call connect-mongo create() with correct parameters", () => {
    process.env.SESSION_STORE = "mongodb://localhost:27017/test-db";
    require("../configs/DB/sessionStorage.config");

    expect(mongoDBStore.create).toHaveBeenCalledWith({
      mongoUrl: "mongodb://localhost:27017/test-db",
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    });
  });

  test("should export a session store object", () => {
    const sessionStoreConfig = require("../configs/DB/sessionStorage.config");
    expect(sessionStoreConfig).toHaveProperty("mongoUrl");
    expect(sessionStoreConfig.collectionName).toBe("sessions");
    expect(sessionStoreConfig.ttl).toBe(86400);
  });
});
