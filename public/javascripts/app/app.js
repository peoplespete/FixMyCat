/* global document, window, io */

$(document).ready(initialize);

var socket;

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  $('#startgame').on('submit', clickStartGame);
  $('#shuffle').on('click', clickShuffle);
  $('#game').on('click', '.available', clickMove);
}

function clickShuffle(e){
  sendAjaxRequest('/shuffle', {id: $('#game').attr('data-id')}, 'post', null, e, function(data, status, jqXHR){
    console.log(data);
    htmlShuffleBoard(data, 'current');
  });
}

function clickStartGame(e){
  var url = '/';
  var data = $('form#startgame').serialize();

  sendAjaxRequest(url, data, 'post', null, e, function(data, status, jqXHR){
    htmlCreateBoard(data, 'home');
  });
}

///////////////////////////////////////////////////////////////////////////////////////////


function htmlCreateBoard(data, pos){
  $('form#startgame').addClass('hidden');
  $('#game').attr('data-id', data._id);
  var blank = {};

  for(var i = 0; i < data.tiles.length; i++){
    var x = data.tiles[i][pos][0];
    var y = data.tiles[i][pos][1];

    var $div = $('<div data-x=' + x + ' data-y=' + y + '><img src="../images/cat' + x + '_' + y + '.png"</div>');
    $div.addClass('tile');

    $('#game').append($div);

    $('#shuffle').removeClass('hidden');
  }

}

function htmlShuffleBoard(data, pos){
 //problem somewehre here!!!!should be sorted by current and then placed in order

  $('.tile').remove();
  var blank = {};

  var tiles = [];
  for(var i =0; i<data.tiles.length;i++){
    tiles.push(data.tiles[i]);
  }
  tiles = _.sortBy(tiles, function(t){
    return [t.current[0],t.current[1]];
  });
  console.log(tiles);
  for(var i = 0; i < data.tiles.length; i++){
    var x = tiles[i][0];
    var y = tiles[i][1];
    var xHome = data.tiles[i].current[0];
    var yHome = data.tiles[i].current[1];
    var help = {};
    help.home = [xHome,yHome];
    help.current = [x,y];
    help.img =  '<img src="../images/cat' + x + '_' + y + '.png">';
    console.log(help);

    var $div = $('<div data-x=' + x + ' data-y=' + y + '><img src="../images/cat' +  + '_' + y + '.png" ></div>');

    $div.addClass('tile');

    $('#game').append($div);

    $('#shuffle').addClass('hidden');
  }

  blank = _.find(data.tiles, function(t){ return t.blank; });

  console.log(blank);
  $('.tile[data-x=' + blank.current[0] + '][data-y=' + blank.current[1] + ']').addClass('empty');

  availableMoves(blank);
}

///////////////////////////////////////////////////////////////////////////////////////////
function initializeSocketIO(){
  var port = window.location.port ? window.location.port : '80';
  var url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/app';

  socket = io.connect(url);
  socket.on('connected', socketConnected);
}

function socketConnected(data){
  console.log(data);
}


function availableMoves(blank){
  var x = blank.current[0];
  var y = blank.current[1];
  $('.tile[data-x='+(x-1)+'][data-y='+y+']').addClass('available');
  $('.tile[data-x='+(x+1)+'][data-y='+y+']').addClass('available');
  $('.tile[data-x='+x+'][data-y='+(y-1)+']').addClass('available');
  $('.tile[data-x='+x+'][data-y='+(y+1)+']').addClass('available');
}

function clickMove(){
  // alert('sup');
//send ajax request
  var x = $(this).data('x');
  var y = $(this).data('y');
  var id = $('#game').data('id');
  var url = '/';
  var data = {x: x, y: y, id: id};
  console.log(data);
  sendAjaxRequest(url, data, 'post', 'put', null, function(data, status, jqXHR){
    console.log(data);
    if(data.status){
      alert('You win!');
    }
    htmlCreateBoard(data);
  });
}
