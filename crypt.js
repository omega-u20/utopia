import crypto from 'crypto';

async function generateUserID(role) {
    return `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function hashPassword(pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
}

export {generateUserID, hashPassword};