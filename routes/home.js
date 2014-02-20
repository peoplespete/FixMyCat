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
    game.markModified('tiles');
    game.save(function(err,game){res.send(game);});
  });
};


//POST /

exports.create = function(req, res){
  new Game(req.body).save(function(err, game){
    res.send(game);
  });
};


//PUT /

exports.move = function(req, res){
  var clickedCurrent = [parseInt(req.body.x), parseInt(req.body.y)];
  var emptyCurrent = [parseInt(req.body.emptyx), parseInt(req.body.emptyy)];
  Game.findById(req.body.id, function(err, game){
    game = swapCurrents(game, emptyCurrent, clickedCurrent);
    game = checkForWin(game);
    game.markModified('tiles');
    game.markModified('didWin');
    game.save(function(err,game){
      res.send(game);
    })
  });
};

////////////////////////////////////////////////////////////


function swapCurrents(game, emptyCurrent, clickedCurrent){
  var futureClicked;
  var futureEmpty;

  for(var i = 0; i<game.tiles.length; i++){
    if(areEqual(game.tiles[i].current, clickedCurrent)){
      futureEmpty = game.tiles[i].current;
    }else if(areEqual(game.tiles[i].current, emptyCurrent)){
      futureClicked = game.tiles[i].current;
    }
  }
  game.tiles = __.map(game.tiles, function(t){
    if(areEqual(t.current, clickedCurrent)){
      delete t.current;
      t.current = futureClicked;
    }else if(areEqual(t.current, emptyCurrent)){
      delete t.current;
      t.current = futureEmpty;
    }
    return t;
  });
  return game;
}



function checkForWin(game){
//CHECK FOR WIN!!!
    var c = 0;
    for(var i = 0; i<game.tiles.length; i++){
      if(areEqual(game.tiles[i].current, game.tiles[i].home)){
        c++;
      }
    }
    console.log(c);
    if(c === game.tiles.length){
      game.didWin = true;
    }
    return game;
}

function areEqual(array1, array2){
  if(array1.length===array2.length){
    for(var i = 0; i< array1.length; i++){
      if(array1[i] !== array2[i]){
        return false;
      }
    }
    return true;
  }
  return false;
}