const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookie_session = require('cookie-session');
require("dotenv").config({ path: "./config.env" });
const auth_routes = require("./auth-routes")
const passport_setup = require('./passport-setup');
const session = require("express-session");
const cookie_parser = require("cookie-parser"); 

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;
const COOKIE_KEY = process.env.COOKIE_KEY;
// const path = require("path");
const debug = true;

const app = express();
app.use(express.json());
// app.use(cors());
app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    })
);

//connect DB
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(console.error);

//models
const Quote = require("./models/quote");
const Book = require("./models/book")
//API endpoints

//get a spec. book
app.get('/book/id/:id', async (req, res) => {
    if (debug){ console.log("GETTING SPEC. BOOK");}
    const book = await Book.findById(req.params.id)

    res.json(book);
});

//get all books
app.get('/book/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL BOOKS");}
    const book = await Book.find()

    res.json(book);
});

//add a book
app.post('/book', (req, res) => {
    if (debug) { console.log("ADD A BOOK"); console.log(req.body) }

    const book = new Book({
        title: req.body.title
    })

    book.save();

    res.json(book);
});

//delete a book
app.delete('/book', async (req, res) => {
    if (debug) { console.log("DELETING A BOOK"); console.log(req.body) }

    const del_book = await Book.findByIdAndDelete(req.body.id);
    const del_quote = await Quote.deleteMany({book: req.body.id});

    res.json({book: del_book, quotes: del_quote });
});

//get all quotes for a specific book
app.get('/quote/id/:id', async (req, res) => {
    if (debug) { console.log("GETTING QUOTES FOR SPEC. BOOK");}

    const quote = await Quote.find({book: req.params.id})

    res.json(quote);
});

//get all quotes
app.get('/quote/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL QUOTES");}

    const quote = await Quote.find()

    res.json(quote);
});

//add a quote
app.post('/quote', (req, res) => {
    if (debug) { console.log("ADDING A QUOTE"); console.log(req.body) }

    const quote = new Quote({
        text: req.body.text,
        book: req.body.book
    })

    quote.save();

    res.json(quote);
});

//delete a quote by its ID
app.delete('/quote', async (req, res) => {
    if (debug) { console.log("DELETING A QUOTE"); console.log(req.body) }

    const result = await Quote.findByIdAndDelete(req.body.id);

    res.json({ result });
});

//testing
app.get('/test', async (req, res) => {

    res.json({ result: "hey" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


//GOOGLE AUTH
// app.use(cookie_session({
//     name: 'google-auth-session',
//     keys: ['key1', 'key2']
// }))

app.use(
    cookie_session({
        name: "google-auth-session",
        keys: [COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
    })
);
app.use(cookie_parser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth_routes);

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


// app.get("/", (req, res) => {
//     res.json({ message: "You are not logged in" })
// })


// //successful login
// app.get("auth/login/success", (req, res) => {
//     res.send(`Welcome ${req.user.email}`)
// })

// //unsucessful login
// app.get("auth/login/failed", (req, res) => {
//     res.send("Failed")
// })

// //redirect client to google login
// app.get('/auth/google',
//     passport.authenticate('google', {
//         scope:
//             ['email', 'profile']
//     })
// );

// //callback URL for successful login -- must be same as URL specified in google cloud console
// app.get('/auth/google/redirect',
//     passport.authenticate('google', {
//         failureRedirect: '/auth/login/failed',
//     }),
//     function (req, res) {
//         res.redirect('/auth/login/success')

//     }
// );