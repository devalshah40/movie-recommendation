#!/usr/bin/env node

const axios = require("axios");
const _ = require("lodash");
const moment = require('moment');

const url = "https://pastebin.com/raw/cVyp3McN";

module.exports = {
  getMovieList: getMovieList,
  getMovieRecommendation: getMovieRecommendation
}

async function getMovieList() {
  let moviesList = await axios.get(url, { headers: { Accept: "application/json" } });
  return moviesList;
}

async function getMovieRecommendation(genre, time) {
  let userTime = moment(time , moment.HTML5_FMT.TIME).add(30, 'minutes');
  let moviesResult = await this.getMovieList();

  let filteredMovies = [];
  if (!_.isEmpty(moviesResult.data)) {
    filteredMovies = _.filter(moviesResult.data, (movieObj) => {
      let moviesTime = moment(movieObj.showings[0] , "HH:mm:ssZZ");
      return (_.includes(movieObj.genres || [], genre) && (moviesTime > userTime));
      // return ((moviesTime > userTime));
    });

    let sortedMovies = (filteredMovies.length) ? _.orderBy(filteredMovies, ['rating'],['asc']) : filteredMovies;
    return sortedMovies;
  }

  if (!filteredMovies.length) {
    return "no movie recommendations";
  }
}
