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

  var clickedCurrent = [req.body.x, req.body.y];
  var emptyCurrent = [req.body.emptyx, req.body.emptyy];
  console.log(clickedCurrent + '! clicked before switch');
  console.log(emptyCurrent + '! empty before switch');
  Game.findById(req.body.id, function(err, game){
    var futureClicked;
    var futureEmpty;
    game.tiles = __.map(game.tiles, function(t){
      if((t.current[0] == clickedCurrent[0]) && (t.current[1] == clickedCurrent[1])){
        //if it is the clicked tile
        futureClicked = emptyCurrent;
      }else if((t.current[0] == emptyCurrent[0]) && (t.current[1] == emptyCurrent[1])){
        //if it is the empty tile
        futureEmpty = clickedCurrent;
      }
      return t;
    });
    game.tiles = __.map(game.tiles, function(t){
      if((t.current[0] == clickedCurrent[0]) && (t.current[1] == clickedCurrent[1])){
        //if it is the clicked tile
        t.current = futureClicked;
        console.log(t.current + '! clicked after switch');
      }else if((t.current[0] == emptyCurrent[0]) && (t.current[1] == emptyCurrent[1])){
        //if it is the empty tile
        t.current = futureEmpty;
        console.log(t.current + '! empty after switch');
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
    console.log(c);
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


