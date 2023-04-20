const PORT = process.env.PORT || 5000;
const app = require("./app");
const mongoose = require('mongoose');
require("dotenv").config({ path: "./config.env" });
const URI = process.env.ATLAS_URI_TEST;
const User = require("./models/user")
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(console.error)
    .finally(async () => {
        async function update_collections() {
            const old_user = "6423984cd99e1a4a7cb58ea6";
            const new_user = "6439ab8c6f5f610b8b9e2c94";
            //migrate books from old to new user
            // const old_books = await Book.find({ user: old_user })
            // old_books.forEach(d => {
            //     const book = new Book({
            //         title: d.title,
            //         user: "6439ab8c6f5f610b8b9e2c94"
            //     })

            //     book.save();
            // })

            //migrate quotes
            // const old_books = await Book.find({ title: "Speak, Okinawa", user: new_user });
            // console.log(old_books);

            //get book titles
            //old quotes -> match to books via bookIDs
            //set new quotes by using the old matched IDs and setting it
            //  for books for the old user && same title
        }
        update_collections();
    }
);