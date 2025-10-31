const crypto = require('crypto');

const generatePID = () => {
    const randomPart = crypto.randomBytes(4).toString('hex');
    const timestampsPart = Date.now().toString(36);
    return `CC-${timestampsPart}-${randomPart}`.toUpperCase();
};

module.exports = generatePID;