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
      // if(game.tiles[i].blank){
      //   console.log(game.tiles[i]);
      // }
    }
    game.markModified('tiles');
    game.save(function(err,game){res.send(game);});
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
//req.body must have .x and .y of clicked and .id of board and .emptyx and .emptyy of empty
  //it is just not putting the blank in the right spot when it returns game.

  var clickedCurrent = [parseInt(req.body.x), parseInt(req.body.y)];
  var emptyCurrent = [parseInt(req.body.emptyx), parseInt(req.body.emptyy)];
  Game.findById(req.body.id, function(err, game){
    game = swapCurrents(game, emptyCurrent, clickedCurrent);
    game = checkForWin(game);
    game.markModified('tiles');
    game.markModified('didWin');
    game.save(function(err,game){
      // for(var i = 0; i<game.tiles.length; i++){
      //   console.log('afterSAVE    current:' + game.tiles[i].current + '  home:'+game.tiles[i].home);
      // }
      res.send(game);
    })
  });
};

//


function swapCurrents(game, emptyCurrent, clickedCurrent){
  var futureClicked;
  var futureEmpty;
  // console.log(clickedCurrent + '! clicked before switch');
  // console.log(emptyCurrent + '! empty before switch');

  for(var i = 0; i<game.tiles.length; i++){
    // console.log('before switch    current:' + game.tiles[i].current + '  home:'+game.tiles[i].home + 'blank:' + game.tiles[i].blank);
    if(areEqual(game.tiles[i].current, clickedCurrent)){
      //if it is the clicked tile
      futureEmpty = game.tiles[i].current;
    }else if(areEqual(game.tiles[i].current, emptyCurrent)){
      //if it is the empty tile
      futureClicked = game.tiles[i].current;
    }
  }
  // console.log('FUTURE CLICKED:' + futureClicked);
  // console.log('FUTURE EMPTY:' + futureEmpty);
  game.tiles = __.map(game.tiles, function(t){
    if(areEqual(t.current, clickedCurrent)){
      //if it is the clicked tile
      delete t.current;
      t.current = futureClicked;
      // console.log(t.current + '! clicked after switch');
    }else if(areEqual(t.current, emptyCurrent)){
      //if it is the empty tile
      delete t.current;
      t.current = futureEmpty;
      // console.log(t.current + '! empty after switch');
    }
    return t;
  });
  // for(var i = 0; i<game.tiles.length; i++){
  //   console.log('after switch    current:' + game.tiles[i].current + '  home:'+game.tiles[i].home + 'blank:' + game.tiles[i].blank);
  // }
  return game;
}



function checkForWin(game){
//implement later
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