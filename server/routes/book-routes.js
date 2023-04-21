const router = require("express").Router();
const Book = require("../models/book");
const Quote = require("../models/quote");
require("dotenv").config({ path: "./config.env" });
const debug = process.env.DEBUG === "1"; 

//get a spec. book
router.get('/id/:id', async (req, res) => {
    if (debug) { console.log("GETTING SPEC. BOOK"); }
    const book = await Book.findById(req.params.id)
    const quotes = await Quote.find({book: req.params.id})

    res.json({book: book, quotes: quotes});
});

//get all books
router.get('/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL BOOKS");}
    const book = await Book.find()

    res.json(book);
});

//get all books for a spec. user
router.get('/all_for_user/:id', async (req, res) => {
    if (debug) { console.log("GETTING ALL BOOKS FOR USER"); console.log(req.params.id) }
    const user = req.params.id;
    const book = await Book.find({user: user})
    res.json(book);
});

//add a book
router.post('/', (req, res) => {
    if (debug) { console.log("ADD A BOOK"); console.log(req.body) }

    const book = new Book({
        title: req.body.title,
        user: req.body.user_id
    })

    book.save();

    res.json(book);
});

//delete a book
router.delete('/', async (req, res) => {
    if (debug) { console.log("DELETING A BOOK"); console.log(req.body) }

    const del_book = await Book.findByIdAndDelete(req.body.id);
    const del_quote = await Quote.deleteMany({ book: req.body.id });

    res.json({ book: del_book, quotes: del_quote });
});

module.exports = router