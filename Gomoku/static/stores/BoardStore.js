var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var assign = require('react/lib/Object.assign');
var socketHandler = require('../socketHandler');

var win = 0;
var loss = 0;
var moves = 0;
var request = 0;
var playerId = 0;
var running = false;
var winner = 0;
var maxRoomId = 0;  //  Rooms are indexed with successive integers. Max index is enough.
var board = [];
for (var i = 0; i < 18; i++) {
  board.push((new Array(18)).fill(0));
};

function setWinner(player) {
  // 1 upon winning, -1 upon losing, and 0 otherwise.
  if (playerId === 0) return;
  if( player === playerId ) {
    winner = 1;
    win++;
  } else {
    winner = -1;
    loss++;
  }
}

function setSide(side) {
  if( !playerId ) {
    playerId = side;
  }
  reset();
}

function start() {
  running = true;
}

function setMaxRooms(max) {
  maxRoomId = max;
}

function reset() {
  board = [];
  for (var i = 0; i < 18; i++) {
    board.push((new Array(18)).fill(0));
  };
  running = false;
  winner = 0;
  request = 0;
  moves = 0;
}

function updateBoard(i, j, player, move) {
  if (move === 1) board[i][j] = player;
  else board[i][j] = 0;
}

function setBoard(new_board) {
  //  called only on watchers
  board = new_board;
  running = true;
}

var BoardStore = assign({}, EventEmitter.prototype, {

  getBoard: function() {
    return board;
  },

  getMaxRoom: function() {
    return maxRoomId;
  },

  isRunning: function() {
    return running;
  },

  getWin: function() {
    return win;
  },

  getLoss: function() {
    return loss;
  },

  winOrLose: function() {
    return winner;
  },

  buttonsEnabled: function() {
    return playerId && moves;
  },

  requestStatus: function() {
    return request;
  },

  emitChange: function() {
    this.emit(Constants.CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(Constants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(Constants.CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case Constants.MOVE:
      if( running && !winner) {
        socketHandler.issueMove(action.i, action.j, playerId);
      }
      break;
    case Constants.WAIT:
      setSide(1);
      break;
    case Constants.START:
      setSide(2);
      start();
      break;
    case Constants.UPDATE_BOARD:
      updateBoard(action.i, action.j, action.player, action.move);
      if (action.move === -1) winner = 0;
      moves += action.move;
      request = 0;
      break;
    case Constants.UPDATE_ROOMS:
      setMaxRooms(action.max);
      break;
    case Constants.DISCONNECT:
      reset();
      break;
    case Constants.SET_BOARD:
      setBoard(action.board);
      break;
    case Constants.WIN:
      setWinner(action.player);
      break;
    case Constants.RESTART:
      reset();
      running = true;
      break;
    case Constants.REQ_RESTART:
      if (request !== -1) {
        request = -1;
        socketHandler.requestRestart();
      }
      break;
    case Constants.REQ_UNDO:
      if (request !== -2) {
        request = -2;
        socketHandler.requestUndo();
      }
      break;
    case Constants.REQUEST:
      if (request + action.request !== 0) {
        if (playerId !== 0) request = action.request;
        else request = action.request + 2;
      }
      break;
    default:
      console.log("Did something happen? -- from BoardStore");
    // actions
  }

  BoardStore.emitChange();
  return true;
});

module.exports = BoardStore;