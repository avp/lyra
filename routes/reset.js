var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs');

router.get('/', function(req, res) {
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect('mongodb://127.0.0.1:27017/musicsort', function(err, db) {
    if (err) {
      throw err;
    }

    var collection = db.collection('songs');

    collection.remove({}, function(err) {
      if (err) {
        throw err;
      }

      fs.readFile('playlists.txt', 'utf8', function(err, data) {
        if (err) {
          throw err;
        }

        var songs = _.chain(data.split('\n')).filter(function(song) {
          return song.split('|').length === 3;
        }).map(function(song) {
          var data = song.split('|');
          return {
            playlist: data[0].trim(),
            artist: data[1].trim(),
            title: data[2].trim(),
            wins: 0,
            losses: 0,
            elo: 1000
          };
        }).value();

        collection.insert(songs, function(err) {
          if (err) {
            throw err;
          }
        });
        res.send('1');
      });
    });

  })
});

module.exports = router;
