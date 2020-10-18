const express = require("express");
const cors = require("cors");
const app = express();

//Here you add the origins that you want. You can add as much as possible
const whiteList = ["http://localhost:3000", "https://localhost:3443"]

var corsOptionsDelegate = (req, callback) =>{
    var corsOptions;

    //If the request Header Contains Origin, then we check the incoming Origin if it
    //is present in our whiteList
    if(whiteList.indexOf(req.header("Origin")) !== -1){
        
        //Here the condition is that the reqest Header is present
        //So we will allow the origin to be accepted
        corsOptions = { origin: true};
    }
    else{   //If the request origin is not in the whiteList, then:

        corsOptions = {origin: false};
    }

    callback(null, corsOptions)
}


exports.cors = cors();  //We use this when we do not need to specify any cors options
exports.corsWithOptions = cors(corsOptionsDelegate); //Here we need to specify cors options that we need