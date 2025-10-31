const mongoDBStore = require('connect-mongo');

const sessionStoreConfig = mongoDBStore.create({
    mongoUrl : process.env.SESSION_STORE || "mongodb://localhost:27017/ses2",
    collectionName : "sessions",
    ttl : 24 * 60 * 60,
});

module.exports = sessionStoreConfig;