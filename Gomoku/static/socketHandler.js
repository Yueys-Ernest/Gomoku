var Actions = require('./actions/Actions');
var socketIO = require('socket.io-client');

var mainSocket = undefined;
var room = undefined;

var socketHandler = {

  init: function() {
    mainSocket = socketIO().on('rooms', function(max_room_index) {
      Actions.update_rooms(max_room_index);
    });
  },

  requestRestart: function() {
    if (room)
      room.emit('request_restart');
  },

  requestUndo: function() {
    if (room)
      room.emit('request_undo');
  },

  connectRoom: function(num) {  
    //  num should be a string containing only number between 0 and 9 (one digit)
    if( room && room.nsp !== ('/' + num)) {
      room.disconnect();
    }
    room = socketIO('/' + num);
    room.on('move_made', function(action) {
      Actions.update_board(action.i, action.j, action.player, 1);
    })
    room.on('wait', function() {
      Actions.wait();
      console.log('waiting')
    })
    room.on('start_game', function() {
      Actions.start_game();
      console.log('start game')
    })
    room.on('disconnect', function() {
      Actions.disconnect_room();
    })
    room.on('game_status', function(board) {
      Actions.set_board(board);
    })
    room.on('win', function(player) {
      Actions.win(player);
    })
    room.on('restart', function() {
      Actions.restart();
    })
    room.on('undo', function(action) {
      Actions.update_board(action.i, action.j, action.player, -1);
    })
    room.on('request_status', function(request) {
      Actions.handle_request(request);
    })
  },

  issueMove: function(i, j, player) {
    room.emit('move', {
      i: i,
      j: j,
      player: player
    });
  },
};

module.exports = socketHandler;
