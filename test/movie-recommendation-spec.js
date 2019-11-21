const sinon = require('sinon');
const assert = require('chai').assert;
const expect = require('chai').expect;
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

let movieRecommendation = require('../movie-recommendation');
const moviesJson = JSON.parse(fs.readFileSync('test/data/movies.json', 'utf-8'));

describe("Movie recommendations", function()  {
    
    afterEach(function () {
        sinon.restore();
    });

    it('should return "no movie recommendations" when no movies list', async function () {
        
        sinon.stub(movieRecommendation, 'getMovieList').returns({data:[]});

        let data = await movieRecommendation.getMovieRecommendation('Animation', '12:00');
       
        assert.equal(movieRecommendation.getMovieList.calledOnce, true);
        assert.equal(data, "no movie recommendations");
    });

    it('should return sorted result by rating', async function () {
        
        sinon.stub(movieRecommendation, 'getMovieList').returns(moviesJson);
        let moviesResult = await movieRecommendation.getMovieRecommendation('Animation', '12:00');    
        
        let isSorted = true;
        for (let i = 0; i < moviesResult.length - 1; i++) {
            if (moviesResult[i].rating > moviesResult[i+1].rating) {
                isSorted = false;
                break;
            }
        }
        assert.equal(isSorted, true);
    });

    it('should return result started after 30 mins', async function () {
        
        sinon.stub(movieRecommendation, 'getMovieList').returns(moviesJson);
        let moviesResult = await movieRecommendation.getMovieRecommendation('Animation', '12:00');    
        
        let isScheduledAfter30Mins = true;
        _.forEach(moviesResult, (movieObj) => {
          let moviesTime = moment(movieObj.showings[0] , "HH:mm:ssZZ");
          let userTime = moment('12:00', moment.HTML5_FMT.TIME).add(30, 'minutes');
          if (moviesTime < userTime) {
            isScheduledAfter30Mins = false;
            return false;
          }
        });
        assert.equal(isScheduledAfter30Mins, true);
    });

});