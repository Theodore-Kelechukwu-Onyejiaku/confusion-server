const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

const Leaders = require("../models/Leaders");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//This is a middleware that will apply to all requests made to "Leaders" resource
leaderRouter.route("/")
.get((req, res, next)=>{
    Leaders.find({})
    .then(leaders =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leaders)
    }, (err) => next(err))
    .catch(err =>  next(err))
})
//POST creates a new resource
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    authenticate.verifyAdmin(req, res, next);
    Leaders.create(req.body)
    .then(leaders =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leaders)
    }, (err) => next(err))
    .catch( (err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    authenticate.verifyAdmin(req, res, next);
    Leaders.remove({})
    .then(resp =>{
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp)
    }, (err) => next(err))
    .catch(err => next(err));
});


//For leaderId's
leaderRouter.route("/:leaderId")
.get((req, res, next)=>{
    Leaders.findById(req.params.leaderId)
    .then(leader =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader)
    }, (err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/"
        + req.params.leaderId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    authenticate.verifyAdmin(req, res, next);
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
    .then(leader =>{
        console.log("leader Updated", leader._doc);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
    }, (err) => next(err))
    .catch(err => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=>{
    authenticate.verifyAdmin(req, res, next);
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then(leader =>{
        console.log("Leader Removed!", leader._doc)
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(leader)
    }, err => next(err))
    .catch(err => next(err))
})



module.exports = leaderRouter;