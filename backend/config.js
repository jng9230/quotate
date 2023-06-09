/**
 * file to consolidate local development config and production secrets
 */
// require("dotenv").config({ path: ".env" });
if (process.env.ENVIRONMENT !== 'production') {
    require('dotenv').config({ path: ".env" })
}
// const secrets = require('@cloudreach/docker-secrets');
const secrets = {}
const PORT  = 5000
module.exports = config = {
    ATLAS_URI : secrets.ATLAS_URI || process.env.ATLAS_URI,
    ATLAS_URI_TEST : process.env.ATLAS_URI_TEST,
    GOOGLE_CLIENT_ID : secrets.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : secrets.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL || `http://localhost:${PORT}/auth/google/redirect`,
    COOKIE_KEY : secrets.COOKIE_KEY || process.env.COOKIE_KEY,
    JWT_KEY : secrets.JWT_KEY || process.env.JWT_KEY,
    PORT : PORT,
    PORT_TEST : 5001,
    CLIENT_HOME_PAGE_URL: process.env.CLIENT_HOME_PAGE_URL,
    DEBUG : "1",
}