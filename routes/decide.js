var express = require('express');
var router = express.Router();
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;

var elo = require('elo-rank')(32);

router.get('/', function(req, res) {
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect('mongodb://127.0.0.1:27017/musicsort', function(err, db) {
    var songs = db.collection('songs').find();
    songs.toArray(function(err, songs) {
      if (err) {
        throw err;
      }

      songs = _.shuffle(songs);
      res.send({
        a: songs[0],
        b: songs[1]
      });
    });
  });
});

router.post('/', function(req, res) {
  var MongoClient = require('mongodb').MongoClient;

  var winnerId = req.body.winner;
  var loserId = req.body.loser;

  MongoClient.connect('mongodb://127.0.0.1:27017/musicsort', function(err, db) {
    var collection = db.collection('songs');
    collection.findOne({_id: new ObjectID(winnerId)}, function(err, winner) {
      if (err) throw err;
      collection.findOne({_id: new ObjectID(loserId)}, function(err, loser) {
        if (err) throw err;
        winner.wins++;
        loser.losses++;

        var winnerExp = elo.getExpected(winner.elo, loser.elo);
        var loserExp = elo.getExpected(loser.elo, winner.elo);

        console.log(winnerExp, loserExp);

        winner.elo = elo.updateRating(winnerExp, 1, winner.elo);
        loser.elo = elo.updateRating(loserExp, 0, loser.elo);
        console.log(winner, loser);

        collection.save(winner, _.noop);
        collection.save(loser, _.noop);
        res.send(200);
      });
    });
  });
});

module.exports = router;
