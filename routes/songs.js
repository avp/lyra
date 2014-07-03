var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');

router.get('/', function(req, res) {
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect('mongodb://127.0.0.1:27017/musicsort', function(err, db) {
    var songs = db.collection('songs').find();
    songs.toArray(function(err, songs) {
      songs = _.chain(songs).sortBy('elo').reverse().value();
      res.render('songs', {songs: songs});
    });
  });
});

module.exports = router;
