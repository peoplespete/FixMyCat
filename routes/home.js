var _ = require('lodash');

//GET /

exports.index = function(req, res){
  res.render('home/index', {title: 'Fix My Cat'});
};

//POST /

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
