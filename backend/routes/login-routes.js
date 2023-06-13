const router = require("express").Router();
const config = require("../config")
require('../passport-google-setup');
const CLIENT_HOME_PAGE_URL = config.CLIENT_HOME_PAGE_URL;
const debug = config.DEBUG === "1";
const User = require("../models/user");
const Chance = require("chance")

const chance = new Chance()
router.get("/guest", async (req, res) => {
    const email = chance.email();
    User.findOrCreate(
        { email: email },
        { name: "guest", email: email, is_guest: true },
        function (err, user) {
            return res.json(user)
        }
    );
})

module.exports = router;