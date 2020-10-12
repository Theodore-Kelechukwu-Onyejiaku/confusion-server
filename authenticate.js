var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JWTStrategy = require("passport-jwt").Strategy;
var ExtractJWT = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");

var config = require("./config");


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600})
}

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken(); //Extracts token from the authentication header
opts.secretOrKey = config.secretKey; //This supplies the secret key

exports.jwtPassport = passport.use(new JWTStrategy(opts, (jwt_payload, done)=>{
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user)=>{
        if(err){
            return done(err, false) //This is an error, so we won't pass user value by using false
        }else if(user){
            return done(null, user);
        }else{
            return done(null, user)   //Here we can't find the user
        }
    })
}))



exports.verifyUser = passport.authenticate("jwt", {session: false}); //This means we are not using sessions


exports.verifyAdmin = (req, res, next)=>{
    if(req.user.admin == false){
        var err = new Error("You are not authorized to perform this operation");
        err.status = 403;
        return next(err)
    }else{
        next()
    }
}