var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {
  
  move: function(i, j) {
  	AppDispatcher.handleViewAction({
  		actionType: Constants.MOVE,
  		i: i,
  		j: j
  	})
  },

  update_board: function(i, j, player, move) {
  	AppDispatcher.handleServerAction({
  		actionType: Constants.UPDATE_BOARD,
  		i: i,
  		j: j,
  		player: player,
      move: move
  	});
  },

  wait: function() {
  	AppDispatcher.handleServerAction({
  		actionType: Constants.WAIT
  	});
  },

  start_game: function() {
    AppDispatcher.handleServerAction({
      actionType: Constants.START
    })
  },

  update_rooms: function(max) {
    AppDispatcher.handleServerAction({
      actionType: Constants.UPDATE_ROOMS,
      max: max
    })
  },

  disconnect_room: function() {
    AppDispatcher.handleServerAction({
      actionType: Constants.DISCONNECT
    })
  },

  set_board: function(board) {
    AppDispatcher.handleServerAction({
      actionType: Constants.SET_BOARD,
      board: board
    })
  },

  win: function(player) {
    AppDispatcher.handleServerAction({
      actionType: Constants.WIN,
      player: player
    })
  },

  restart: function() {
    AppDispatcher.handleServerAction({
      actionType: Constants.RESTART
    })
  },

  request_restart: function() {
    AppDispatcher.handleViewAction({
      actionType: Constants.REQ_RESTART
    })
  },

  request_undo: function() {
    AppDispatcher.handleViewAction({
      actionType: Constants.REQ_UNDO
    })
  },

  handle_request: function(request) {
    AppDispatcher.handleViewAction({
      actionType: Constants.REQUEST,
      request: request
    })
  }
  // Actions go here

};

module.exports = Actions;
