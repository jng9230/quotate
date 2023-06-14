const AnonymIdStrategy = require('passport-anonym-uuid').Strategy;
const passport = require("passport");
const User = require("./models/user");
const Chance = require("chance")
const chance = Chance()
passport.serializeUser((user, done) => {
    console.log("ANON SERIALIZE")
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("ANON DESER")
    console.log(id);
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(e => {
            done(new Error("Failed to deserialize the user"));
        });
});

passport.use(new AnonymIdStrategy(
    function (req, uuid, done){
        console.log(uuid)
        const email = chance.email();
        User.findOrCreate(
            { email: email},
            { name: uuid, email: email, is_guest: true },
            function (err, user) {
                console.log("ANON FIND OR CREATE")
                console.log(user);
                return done(err, user);
            }
        )
    }
    // verify: function (req, uuid, done){
    //     const email = chance.email();
    //     User.findOrCreate(
    //         { email: email},
    //         { email: email, is_guest: true },
    //         function (err, user) {
    //             console.log("ANON FIND OR CREATE")
    //             console.log(user);
    //             return done(err, user);
    //         }
    //     )
    // }

));
