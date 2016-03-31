var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var oauth = require('../../config/oauth.json');
var mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost/user');

// create a user model
var User = mongoose.model('User', {
    oauthID: Number,
    name: String,
    created: Date
});

passport.use(new FacebookStrategy({
        clientID: oauth.facebook.clientID,
        clientSecret: oauth.facebook.clientSecret,
        callbackURL: oauth.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) {
                console.log(err);  // handle errors!
            }
            if (!err && user !== null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now()
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
));

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + JSON.stringify(user));
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log('deserializeUser: ' + JSON.stringify(user));
        if(!err) {
            done(null, user)
        } else {
            done(err, null);
        }
    });
});