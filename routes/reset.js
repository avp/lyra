var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs');
var Crypto = require('cryptojs').Crypto;
var basicAuth = require('basic-auth-connect');

router.get('/', basicAuth(function(user, pass) {
  return user === 'admin' && Crypto.MD5(pass).toString() === '7b69b90521d0c3a81c61395387820ab4';
}), function(req, res) {
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
          return song.split('|').length === 4;
        }).map(function(song) {
          var data = song.split('|');
          return {
            playlist: data[0].trim(),
            artist: data[1].trim(),
            title: data[2].trim(),
            albumArtLocation: data[3].trim(),
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
