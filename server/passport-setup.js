require("dotenv").config({ path: "./config.env" });
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const PORT = process.env.PORT || 5000;

const passport = require("passport");
const User = require("./models/user");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.google_id);
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

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/google/redirect`,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        // console.log(request)
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(profile);

        //try to find current user
        const current_user = await User.findOne({
            google_id: profile.id
        });

        //create new user if not found
        if (!current_user){
            const new_user = new User({
                google_name: profile.displayName,
                google_id: profile.id
            }).save()
            if (new_user){
                done(null, new_user)
            }

        }
        done(null, current_user);
    }
));