const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    }
})

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;