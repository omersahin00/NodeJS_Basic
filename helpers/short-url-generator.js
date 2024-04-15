const crypto = require("crypto");

exports.generateShortToken = (length) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buffer) => {
            if (err) {
                reject(err);
            } 
            else {
                const token = buffer.toString('base64')
                    .replace(/\//g, '_')
                    .replace(/\+/g, '-');
                resolve(token);
            }
        });
    });
}