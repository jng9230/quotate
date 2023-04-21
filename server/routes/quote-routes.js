const router = require("express").Router();
const Quote = require("../models/quote");
require("dotenv").config({ path: "./config.env" });
const debug = process.env.DEBUG === 1; 

//get all quotes for a specific book
router.get('/all_for_book/:book_id', async (req, res) => {
    if (debug) { console.log("GETTING QUOTES FOR SPEC. BOOK"); console.log(req.params.book_id)}

    const quote = await Quote.find({ book: req.params.book_id })

    res.json(quote);
});

//get all quotes
router.get('/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL QUOTES"); }

    const quote = await Quote.find()

    res.json(quote);
});

router.get('/all_for_user/:id', async (req, res) => {
    if (debug) { console.log("GETTING ALL QUOTES FOR USER"); console.log(req.params.id) }

    const quote = await Quote.find({user: req.params.id})

    res.json(quote);
});

//add a quote
router.post('/', (req, res) => {
    if (debug) { console.log("ADDING A QUOTE"); console.log(req.body) }

    // const user = req.body.id
    const quote = new Quote({
        text: req.body.text,
        book: req.body.book,
        user: req.body.user_id
    })

    quote.save();

    res.json(quote);
});

//delete a quote by its ID
router.delete('/', async (req, res) => {
    if (debug) { console.log("DELETING A QUOTE"); console.log(req.body) }

    const result = await Quote.findByIdAndDelete(req.body.id);

    res.json({ result });
});

module.exports = router