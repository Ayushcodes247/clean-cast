const mongoDbStore = require("connect-mongo");

const sessionStoreConfig = mongoDbStore.create({
  mongoUrl:
    process.env.SESSION_STORE ||
    "mongodb://0.0.0.1/userMicroservices-sessions-store",
  collectionName: "sessions",
  ttl: 24 * 60 * 60,
});

module.exports = sessionStoreConfig;