var mongoose = require('mongoose');
var __ = require('lodash');

var Game = mongoose.Schema({
  tiles : [{}],
  difficulty : String,
  didWin : {type: Boolean, default: false},
  createdAt : {type: Date, default: Date.now}
});

mongoose.model('Game', Game);

Game.pre('save', function(next){

  if(!this.tiles.length){
    switch(this.difficulty) {
      case 'easy':
        this.tiles = _.map(_.range(16), function(num) { return {}; });

        var x = var y = [0,1,2,3];
        var c = 0;
        for(var i = 0; i < y.length; i++){
          for(var j = 0; j < x.length; j++){
            this.tiles[c].home = [j, i];
            this.tiles[c].current = [];
            c++;
          }
        }


        break;
      default:
        break;
    }
  }

  next();
});