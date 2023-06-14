// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// // require("dotenv").config({ path: "./config.env" });
// const config = require("./config")
// const User = require("./models/user");

// let passportConfig = {};
// passportConfig.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');
// passportConfig.secretOrKey = config.JWT_KEY;
// passport.use(new JwtStrategy(passportConfig, (payload, done) => {
//     User.findById(payload.id)
//         .then(user => {
//             done(null, user);
//         })
//         .catch(e => {
//             done(new Error("Failed to deserialize an user"));
//         });
//         //  (err, user) => {
//         // if (err) {
//         //     return done(err, false);
//         // }
//         // if (user) {
//         //     return done(null, user);
//         // } else {
//         //     return done(null, false);
//         // }
//     // });
// }));

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     User.findById(id)
//         .then(user => {
//             done(null, user);
//         })
//         .catch(e => {
//             done(new Error("Failed to deserialize the user"));
//         });
// });