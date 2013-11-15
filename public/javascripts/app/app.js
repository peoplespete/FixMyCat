/* global document, window, io */

$(document).ready(initialize);

var socket;

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  htmlCreateBoard();
  $('#startgame').on('submit', clickStartGame);
  $('#shuffle').on('click', clickShuffle);

}



function clickShuffle(){
  sendAjaxRequest('/shuffle', {id: $('#game').attr('data-id')}, 'post', null, null, function(err, game){
    console.log(game);
  });
}

function clickStartGame(){
  var url = "/";
  var data = $('form#startgame').serialize();
  sendAjaxRequest(url, data, 'post', null, null, function(err, game){
    console.log(game);
    htmlCreateBoard();
  });
}


///////////////////////////////////////////////////////////////////////////////////////////


function htmlCreateBoard(){
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


