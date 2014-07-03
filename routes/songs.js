var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');

/* GET users listing. */
router.get('/', function(req, res) {
  fs.readFile('playlists.txt', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }

    var songs = _.chain(data.split('\n')).map(function(song) {
      console.log(song.split('|'));
      return song.split('|').splice(1).join('-').trim();
    }).shuffle().value();

    res.send(songs);
  });
});

module.exports = router;
