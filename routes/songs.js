var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');

router.get('/', function(req, res) {
  fs.readFile('playlists.txt', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }

    var songs = _.chain(data.split('\n')).map(function(song) {
      return song.split('|').splice(1).join('-').trim();
    }).shuffle().value();

    res.send(songs);
  });
});

module.exports = router;
