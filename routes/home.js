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
  //req.body should have player and difficulty
  new Game(req.body).save(function(err, game){
    res.send(game);
  });
};


//PUT /

exports.move = function(req, res){
//req.body must have .x and .y of clicked and .id of board
  var clickedCurrent = [req.body.x, req.body.y];
  Game.findById(req.body.id, function(err, game){
    var emptyTile = _.find(game.tiles, function(t){
      return t.blank;
    });
    game.tiles = _.map(game.tiles, function(t){
      if(t.current === clickedCurrent){
        t.current = emptyTile.current;
      }else if(t.blank){
        t.current = clickedCurrent;
      }
      return t;
    });
    //CHECK FOR WIN!!!
    var c = 0;
    for(var i = 0; i<game.tiles.length; i++){
      if(game.tiles[i].current === game.tiles[i].home){
        c++;
      }
    }
    if(c === game.tiles.length){
      game.didWin = true;
      game.save(function(err, game){
        res.send({status:'win'});
      });
    }else{
      game.save(function(err, game){
        res.send(game);
      });
    }
  });
};

//
