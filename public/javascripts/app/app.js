/* global document, window, io */

$(document).ready(initialize);

var socket;

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  htmlCreateBoard();
  $('#shuffle').on('click', clickShuffle);
}

function htmlCreateBoard(){
}


function clickShuffle(){
  sendAjaxRequest('/shuffle', {id: $('#game').attr('data-id')}, 'post', null, null, function(err, game){
    console.log(game);
  });
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
