/* global document, window, io */

$(document).ready(initialize);

var socket;

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  // htmlCreateBoard();
  $('#startgame').on('submit', clickStartGame);
  $('#shuffle').on('click', clickShuffle);
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
    // console.log(data);
    htmlCreateBoard(data);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////

function htmlCreateBoard(data){
  for(var i = 0; i < data.tiles.length; i++){
    var x = data.tiles[i].home[0];
    var y = data.tiles[i].home[1];

    var $div = $('<div data-x=' + x + ' data-y=' + y + '></div>');
    $div.addClass('tile');
    $('#game').append($div);
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


