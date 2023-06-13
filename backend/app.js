const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookie_session = require('cookie-session');
const config = require("./config")
const auth_routes = require("./routes/auth-routes")
const quote_routes = require("./routes/quote-routes")
const book_routes = require("./routes/book-routes")
const user_routes = require("./routes/user-routes")
const login_routes = require("./routes/login-routes")
const cookie_parser = require("cookie-parser");
const body_parser = require("body-parser");
const jwt = require("jsonwebtoken");
require('./passport-jwt-setup')

const COOKIE_KEY = config.COOKIE_KEY;

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    })
);

const Book = require("./models/book")

//testing
app.get('/test', async (req, res) => {
    res.status(200).json({ result: "nice" });
});

app.get('/get_details', passport.authenticate('jwt', { session: false }),
    function (req, res) {
        res.send(req.user.profile);
    }
);


//GOOGLE AUTH
app.use(
    cookie_session({
        name: "google-auth-session",
        keys: [COOKIE_KEY],
        maxAge: 1000 * 60 * 60 * 24 * 7 //time is in ms
    })
);
app.use(cookie_parser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth_routes);
app.use("/quote", quote_routes)
app.use("/book", book_routes)
app.use("/user", user_routes)
app.use("/login", login_routes)

//check for auth on home page load
const auth_check = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            authenticated: false,
            message: "user has not been authenticated"
        });
    } else {
        next();
    }
};

// app.get("/", auth_check, (req, res) => {
//     res.status(200).json({
//         authenticated: true,
//         message: "user successfully authenticated",
//         user: req.user,
//         cookies: req.cookies
//     });
// });

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));


//render the landing page for prod
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
console.log(__dirname)

module.exports = app