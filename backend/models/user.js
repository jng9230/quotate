const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

// const UserSchema = new Schema({
//     google_name: String,
//     google_id: String
// })

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "required"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    is_guest: {
        type: Boolean,
        default: false
    }
    // password: {
    //     type: String,
    //     trim: true,
    //     minlength: 6,
    //     maxlength: 60,
    // },
    // token: {
    //     type: String,
    //     unique: true
    // }
});

UserSchema.plugin(findOrCreate);
UserSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", UserSchema);

module.exports = User;