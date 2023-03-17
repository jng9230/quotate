const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;
const path = require("path");
const debug = true;

const app = express();
app.use(express.json());
app.use(cors());

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
app.get('/book/id', async (req, res) => {
    if (debug){ onsole.log("GETTING SPEC. BOOK"); console.log(req.body)}
    const book = await Book.findById(req.body.id)

    res.json(book);
});

//get all books
app.get('/book/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL BOOKS"); console.log(req.body) }
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

    const result = await Book.findByIdAndDelete(req.body.id);

    res.json({ result });
});


//get all quotes for a specific book
app.get('/quote/id', async (req, res) => {
    if (debug) { console.log("GETTING QUTOES FOR SPEC. BOOK"); console.log(req.body) }

    const quote = await Quote.find({book: req.body.id})

    res.json(quote);
});

//get all quotes
app.get('/quote/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL QUOTES"); console.log(req.body) }

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