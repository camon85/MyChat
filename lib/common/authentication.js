var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var oauth = require('../../config/oauth.json');

passport.use(new FacebookStrategy({
        clientID: oauth.facebook.clientID,
        clientSecret: oauth.facebook.clientSecret,
        callbackURL: oauth.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('profile: ' + JSON.stringify(profile));
        done(null, profile);
        //User.findOrCreate({facebookId: profile.id}, function(err, user) {
        //    if (err) { return done(err); }
        //    done(null, user);
        //});
    }
));

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + JSON.stringify(user));
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser: ' + JSON.stringify(user));
    User.findById(id, function(err, user) {
        done(err, user);
    });
});