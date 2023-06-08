const router = require("express").Router();
const User = require("../models/user");
// require("dotenv").config({ path: "./config.env" });
const config = require("../config")
const debug = config.DEBUG === "1"; 

router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    await user.save()//.then(console.log("saved new user"));

    res.json(user);
})

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
})

router.get("/by_email", async (req, res) => {
    const email = req.body.email;
    const users = await User.find({email:email});
    res.json(users);
})

module.exports = router