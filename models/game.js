var mongoose = require('mongoose');
var __ = require('lodash');

var Game = mongoose.Schema({
  tiles : [{}],
  player : String,
  difficulty : String,
  didWin : {type: Boolean, default: false},
  createdAt : {type: Date, default: Date.now}
});

mongoose.model('Game', Game);

Game.pre('save', function(next){

  if(!this.tiles.length){
    switch(this.difficulty) {
      case 'easy':
        this.tiles = __.map(__.range(16), function(num) { return {}; });

        var x = [0,1,2,3];
        var y = [0,1,2,3];
        var c = 0;
        for(var i = 0; i < y.length; i++){
          for(var j = 0; j < x.length; j++){
            this.tiles[c].home = [j, i];
            this.tiles[c].current = [];
            // this.tiles[c].blank = false;
            c++;
          }
        }

        this.tiles[this.tiles.length - 1].blank = true;
        break;
      default:
        break;
    }
  }

  next();
});