// //MONGODB QUICK START
// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json());
// app.use(require("./routes/record"));
// // get driver connection
// const dbo = require("./db/conn");

// app.listen(port, () => {
//     // perform a database connection when server starts
//     dbo.connectToServer(function (err) {
//         if (err) console.error(err);

//     });
//     console.log(`Server is running on port: ${port}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;
const path = require("path");


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
    console.log("GETTING BOOK BY ID")
    const book = await Book.findById(req.body.id)

    res.json(book);
});

//get all books
app.get('/book/all', async (req, res) => {
    console.log("GETTING ALL BOOKS")
    const book = await Book.find()

    res.json(book);
});

//add a book
app.post('/book', (req, res) => {
    const book = new Book({
        title: req.body.title
    })

    book.save();

    res.json(book);
});

//delete a book
app.delete('/book', async (req, res) => {
    const result = await Book.findByIdAndDelete(req.body.id);

    res.json({ result });
});


//get all quotes for a specific book
app.get('/quote/:book_id', async (req, res) => {
    const quote = Quote.find({book: book_id})

    res.json(quote);
});

//add a quote
app.post('/quote', (req, res) => {
    const quote = new Quote({
        text: req.body.text,
        book: req.body.book
    })

    quote.save();

    res.json(quote);
});

//delete a quote by its ID
app.delete('/quote/delete/:id', async (req, res) => {
    const result = await Quote.findByIdAndDelete(req.params.id);

    res.json({ result });
});

//testing
app.get('/test', async (req, res) => {

    res.json({ result: "hey" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});