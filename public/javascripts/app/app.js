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

function clickShuffle(){
  sendAjaxRequest('/shuffle', {id: $('#game').attr('data-id')}, 'post', null, e, function(data, status, jqXHR){
    console.log(data);
  });
}

function clickStartGame(e){
  var url = '/';
  var data = $('form#startgame').serialize();

  sendAjaxRequest(url, data, 'post', null, e, function(data, status, jqXHR){
    htmlCreateBoard(data);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////

function htmlCreateBoard(data){
 $('form#startgame').toggleClass('hidden');

  for(var i = 0; i < data.tiles.length; i++){
    var x = data.tiles[i].home[0];
    var y = data.tiles[i].home[1];

    var $div = $('<div data-x=' + x + ' data-y=' + y + '><img src="../images/cat' + x + '_' + y + '.png"</div>');
    $div.addClass('tile');

    if(data.tiles[i].blank){
      $div.addClass('empty');
    }

    $('#game').append($div);
    $('#game').data('id', game._id);

    $('#shuffle').removeClass('hidden');

    availableMoves();
  }
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


function availableMoves(){
  var x = $('.empty').data('x');
  var y = $('.empty').data('y');
  $('.tiles[data-x='+(x-1)+'][data-y='+y+']').addClass('available');
  $('.tiles[data-x='+(x+1)+'][data-y='+y+']').addClass('available');
  $('.tiles[data-x='+x+'][data-y='+(y-1)+']').addClass('available');
  $('.tiles[data-x='+x+'][data-y='+(y+1)+']').addClass('available');
}

function clickMove(){
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
