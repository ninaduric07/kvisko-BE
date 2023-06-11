const crypto = require('crypto');

const Hasher = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
};

module.exports = Hasher;