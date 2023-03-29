const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    google_name: String,
    google_id: String
})

const User = mongoose.model("User", UserSchema);

module.exports = User;