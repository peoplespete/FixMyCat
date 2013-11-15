var __ = require('lodash');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');

//GET /

exports.index = function(req, res){
  res.render('home/index', {title: 'Fix My Cat'});
};

//POST /shuffle

exports.shuffle = function(req, res){
  Game.findById(req.body.id, function(err, game){
    var tilesHome = __.map(game.tiles, function(t){
      return t.home;
    });
    var tilesShuffled = __.shuffle(tilesHome);
    for(var i = 0; i<tilesShuffled.length; i++){
      game.tiles[i].current = tilesShuffled[i];
    }
    res.send(game);
  });
};


//POST /

exports.create = function(req, res){
  console.log(req.body);
  //req.body should have player and difficulty
  new Game(req.body).save(function(err, game){
    console.log(game);
    res.send(game);
  });
};


//PUT /

exports.move = function(req, res){
//req.body is game


};
