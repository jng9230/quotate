const router = require("express").Router();
const User = require("../models/user");
// const debug = true;

router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    user.save()//.then(console.log("saved new user"));

    res.json(user);
})

router.get("/", (req, res) => {
    const users = User.find();
    res.json(users);
})

router.get("/by_email", async (req, res) => {
    const email = req.body.email;
    const users = await User.find({email:email});
    res.json(users);
})

module.exports = router