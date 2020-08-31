const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//This is a middleware that will apply to all requests made to "dishes" resource
dishRouter.route("/")
.get((req, res, next)=>{
    Dishes.find({})
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes);
    }, (err) => next(err))
    .catch(err => next(err));
})
//POST creates a new resource
.post((req, res, next)=>{
   Dishes.create(req.body)
   .then(dish =>{
       console.log("Dish created", dish);
       res.statusCode = 200;
       res.setHeader("Content-Type", "application/json");
       res.json(dish);
   }, (err) => next(err))
   .catch(err => next(err));
})
.put((req, res, next)=>{
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
})
.delete((req, res, next)=>{
    Dishes.remove({})
    .then(resp =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    }, (err)=> next(err))
});


//For dishId's
dishRouter.route("/:dishId")
.get((req, res, next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch(err => next(err));
})
.post((req, res, next)=>{
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/"
        + req.params.dishId);
})
.put((req, res, next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
    .then(dish =>{
        console.log("Dish Updated", dish);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch(err => next(err));
})
.delete((req, res, next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(dish =>{
        console.log("Dish removed!", dish);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch(err => next(err));
})



module.exports = dishRouter;

