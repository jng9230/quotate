require("dotenv").config({ path: "./config.env" });
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const PORT = process.env.PORT || 5000;

const passport = require("passport");
const User = require("./models/user");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('./passport-jwt-setup')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(e => {
            done(new Error("Failed to deserialize the user"));
        });
});

// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });

let passportConfig = {};
passportConfig.clientID = GOOGLE_CLIENT_ID,
passportConfig.clientSecret = GOOGLE_CLIENT_SECRET,
passportConfig.callbackURL = `http://localhost:${PORT}/auth/google/redirect`,
passportConfig.passReqToCallback = true
passport.use(new GoogleStrategy(passportConfig,
    async function (request, accessToken, refreshToken, profile, done) {
        User.findOrCreate(
            { email: profile._json.email },
            { name: profile.displayName, email: profile._json.email },
            function (err, user) {
                return done(err, user);
            }
        );
        // //try to find current user
        // const current_user = await User.findOne({
        //     google_id: profile.id
        // });

        // //create new user if not found
        // if (!current_user){
        //     const new_user = new User({
        //         google_name: profile.displayName,
        //         google_id: profile.id
        //     }).save()
        //     if (new_user){
        //         done(null, new_user)
        //     }
        // }
        // done(null, current_user);
    }
));