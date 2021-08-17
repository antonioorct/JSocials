const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function checkPasswords(plain, hash) {
  return await bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, checkPasswords };
