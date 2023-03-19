const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }
})

const Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;