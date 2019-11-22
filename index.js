#!/usr/bin/env node

const yargs = require("yargs");
const movieRecommendation = require('./movie-recommendation');

const options = yargs
 .usage("Usage: $0 -genre <genre> -time <time>")
 .option("genre", { alias: "genre", describe: "genre", type: "string", demandOption: true })
 .option("time", { alias: "time", describe: "time", type: "string" , demandOption: true })
 .argv;

 movieRecommendation.getMovieRecommendation(options.genre, options.time)
 .then( (moviesResult) => console.log(moviesResult))
 .catch(function(e){
    console.log(e);
 })
