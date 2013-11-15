var _ = require('lodash');

//GET /

exports.index = function(req, res){
  res.render('home/index', {title: 'Express'});
};

//POST /shuffle

exports.shuffle = function(req, res){
  Game.findById(req.body.id, function(err, game){
    var tilesHome = _.map(game.tiles, function(t){
      return t.home;
    });
    var tilesShuffled = _.shuffle(tilesHome);
    for(var i = 0; i<tileShuffled.length; i++){
      game.tiles[i].current = tileShuffled[i];
    }
    res.send(game);
  });
};

//POST /

exports.create = function(req, res){
  //req.body should have player and difficulty
  new Game(req.body, function(err, game){
    console.log(game);
    res.send(game);
  });
};


//PUT /

exports.move = function(req, res){
//req.body is game


};