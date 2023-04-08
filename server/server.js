const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookie_session = require('cookie-session');
require("dotenv").config({ path: "./config.env" });
const auth_routes = require("./routes/auth-routes")
const quote_routes = require("./routes/quote-routes")
const book_routes = require("./routes/book-routes")
// require('./passport-google-setup');
// const session = require("express-session");
const cookie_parser = require("cookie-parser"); 
const body_parser = require("body-parser");
const jwt = require("jsonwebtoken");
require('./passport-jwt-setup')

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;
const COOKIE_KEY = process.env.COOKIE_KEY;
const debug = true;

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

//connect DB
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(console.error)
    .finally(() => {
        // async function update_collections() {
        //     // require('mongoose').model('Book').schema.add({ user: String });
        //     console.log("what the fuck")
        //     // Book.updateMany(
        //     //     {},
        //     //     {
        //     //         $set: { user: "6423984cd99e1a4a7cb58ea6" }
        //     //     }
        //     // )
        //     Book.updateOne(
        //         { title: "test"},
        //         { title: "a whole new penis" }
        //     )
        //     // const book = new Book({
        //     //     title: "test",
        //     //     user: "6423984cd99e1a4a7cb58ea6"
        //     // })

        //     // book.save();
        // }

        // update_collections();
    }
    );

//models
const Quote = require("./models/quote");
// const Book = require("./models/book")

//testing
app.get('/test', async (req, res) => {
    // const book = await Book.find()
    // Book.updateOne(
    //     { title: "test"},
    //     { title: "a whole new penis" }
    // )
    res.json({result: "nice"});
    // res.json({ result: "hey" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// app.post("/get_details", passport.authenticate("jwt_strategy", { session: false }), (req, res) => {
//     console.log(req.user);
// });

app.get('/get_details', passport.authenticate('jwt_strategy', { session: false }),
    function (req, res) {
        res.send(req.user.profile);
    }
);


//GOOGLE AUTH
app.use(
    cookie_session({
        name: "google-auth-session",
        keys: [COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 1000 //time is in ms
    })
);
app.use(cookie_parser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth_routes);
app.use("/quote", quote_routes)
app.use("/book", book_routes)

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

app.get("/", auth_check, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.user,
        cookies: req.cookies
    });
});

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
const jwt_check = (req, res, next) => {
    // passport.authenticate("jwt_strategy", { session: false })
    // TODO: idk fix this thing so we can call jwt_check like auth_check
}

// app.route("/get_details", passport.authenticate("jwt_strategy", { session: false }), (req, res) => {
//     console.log(req.user);
// });