const router = require("express").Router();
const Book = require("../models/book");
const debug = false;

//get a spec. book
router.get('/book/id/:id', async (req, res) => {
    if (debug) { console.log("GETTING SPEC. BOOK"); }
    const book = await Book.findById(req.params.id)

    res.json(book);
});

//get all books
router.get('/book/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL BOOKS"); }
    const book = await Book.find()

    res.json(book);
});

//add a book
router.post('/book', (req, res) => {
    if (debug) { console.log("ADD A BOOK"); console.log(req.body) }

    const book = new Book({
        title: req.body.title
    })

    book.save();

    res.json(book);
});

//delete a book
router.delete('/book', async (req, res) => {
    if (debug) { console.log("DELETING A BOOK"); console.log(req.body) }

    const del_book = await Book.findByIdAndDelete(req.body.id);
    const del_quote = await Quote.deleteMany({ book: req.body.id });

    res.json({ book: del_book, quotes: del_quote });
});

module.exports = router