const crypto = require("crypto");

const pidGenerator = () => {
    const randomPart = crypto.randomBytes(4).toString("hex");
    const timestampPart = Date.now().toString(36);
    return `${timestampPart}${randomPart}`.toUpperCase();
};

module.exports = pidGenerator;