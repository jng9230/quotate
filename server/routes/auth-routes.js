const router = require("express").Router();
const passport = require("passport");
// const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "../config.env" })
require('../passport-google-setup');
const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL;

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
    console.log("/login/success")
    if (req.user) {
        console.log(req.user)
        res.status(200);
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    } else {
        console.log("Error from /login/success: NO USER PROVIDED IN REQ")
    }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with google
router.get("/google", passport.authenticate("google", {
    scope: ['email', 'profile'],
    // successRedirect: CLIENT_HOME_PAGE_URL,
    // failureRedirect: "/auth/login/failed"

}));

// redirect to home page after successfully login via google
// router.get("/google/redirect", passport.authenticate("google", {
//         successRedirect: "/auth/login/success",
//         // successRedirect: CLIENT_HOME_PAGE_URL,
//         failureRedirect: "/auth/login/failed"
//     })
// );
router.get('/google/redirect', passport.authenticate("google", {
        failureRedirect: "/auth/login/failed",
        // session: false
    }),
    function (req, res) {
        // const token = jwt.sign({ 
        //     user: { "email": req.user.email }, 
        //     id: req.user._id 
        // }, process.env.JWT_KEY);
        // res.redirect(`${CLIENT_HOME_PAGE_URL}?token=${token}`);
        res.redirect(CLIENT_HOME_PAGE_URL)
    }
);

module.exports = router;