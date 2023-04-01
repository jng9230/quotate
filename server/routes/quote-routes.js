const router = require("express").Router();
const Quote = require("../models/quote");
const debug = false; 

//get all quotes for a specific book
router.get('/quote/id/:id', async (req, res) => {
    if (debug) { console.log("GETTING QUOTES FOR SPEC. BOOK"); }

    const quote = await Quote.find({ book: req.params.id })

    res.json(quote);
});

//get all quotes
router.get('/quote/all', async (req, res) => {
    if (debug) { console.log("GETTING ALL QUOTES"); }

    const quote = await Quote.find()

    res.json(quote);
});

//add a quote
router.post('/quote', (req, res) => {
    if (debug) { console.log("ADDING A QUOTE"); console.log(req.body) }

    const quote = new Quote({
        text: req.body.text,
        book: req.body.book
    })

    quote.save();

    res.json(quote);
});

//delete a quote by its ID
router.delete('/quote', async (req, res) => {
    if (debug) { console.log("DELETING A QUOTE"); console.log(req.body) }

    const result = await Quote.findByIdAndDelete(req.body.id);

    res.json({ result });
});

module.exports = router