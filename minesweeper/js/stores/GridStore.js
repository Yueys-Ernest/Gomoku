// Fisher-Yates (aka Knuth) Shuffle...
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var merge = require('react/lib/merge');

var settingsMsg;
var won = 0;
var played = 0;
var started;
var cells;
var winner;
var numTilesAvailable;
var size = 10;
var numMines = 10;
var mines;
var arr;

function initialize() {
  cells = [];
  started = false;
  winner = 0;
  mines = numMines;
  numTilesAvailable = size * size - mines;
  settingsMsg = '';

  for (var x = 0; x < size; ++x) {
    cells.push([]);
    for (var y = 0; y < size; ++y) {
      cells[x].push( {x: x, y: y, open: false, number: -1, mine: false, mark: false, hit: false} );
    }
  }

  arr = [];
  for (var i = 0; i < size*size; i++) {
    arr.push(i);
  }
  shuffle(arr);
}

initialize();

function countMines(x, y) {
  var count = 0;
  for (var i = x-1; i < x+2; ++i) {
    for (var j = y-1; j < y+2; ++j) {
      if (i >= 0 && i < size && j >= 0 && j < size) {
        if (cells[i][j].mine)
          count++;
      }
    }
  }
  return count;
}

function countMarks(x, y) {
  var count = 0;
  for (var i = x-1; i < x+2; ++i) {
    for (var j = y-1; j < y+2; ++j) {
      if (i >= 0 && i < size && j >= 0 && j < size) {
        if (cells[i][j].mark)
          count++;
      }
    }
  }
  return count;
}

function makeMove(x, y) {
  if (!started) {
    started = true;
    buildMineField(x, y);
  }

  var cell = cells[x][y];

  if (winner !== 0 || cell.open || cell.mark) {
    return;
  }

  cell.open = true;
  if (cell.mine) {
    winner = -1;
    played++; started = false;
    mines = 0;
    cell.hit = true;
    for (var i = 0; i < size; ++i) {
      for (var j = 0; j < size; ++j) {
        if (cells[i][j].mine && !cells[i][j].mark)
          cells[i][j].open = true;
      }
    }
    return;
  }

  numTilesAvailable--;
  if (numTilesAvailable === 0) {
    winner = 1;
    won++; played++; started = false;
    mines = 0;
    for (var i = 0; i < size; ++i) {
      for (var j = 0; j < size; ++j) {
        if (cells[i][j].mine)
          cells[i][j].mark = true;
      }
    }
    return;
  }

  if (cell.number === 0) {
    openAround(x, y);
  }
}

function markMine(x, y) {
  if (cells[x][y].mark) {
    cells[x][y].mark = false;
    mines++;
  } else {
    cells[x][y].mark = true;
    mines--;
  }
}

function openAround(x, y) {
  for (var i = x-1; i < x+2; ++i) {
    for (var j = y-1; j < y+2; ++j) {
      if (i >= 0 && i < size && j >= 0 && j < size) {
          makeMove(i, j);
      }
    }
  }
}

function buildMineField(x, y) {
  var first = x * size + y;
  var mineCount = mines;
  var t = 0;

  while (mineCount > 0) {
    if (arr[t] !== first) {
      var i = Math.floor(arr[t] / size);
      var j = arr[t] % size;
      cells[i][j].mine = true;
      mineCount--;
    }
    t++;
  }

  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < size; ++j) {
      if (!cells[i][j].mine) {
        cells[i][j].number = countMines(i, j);
      }
    }
  }
}

var GridStore = merge(EventEmitter.prototype, {

  getAllCells: function() {
    return cells;
  },

  getMines: function() {
    return mines;
  },

  getWinner: function() {
    return winner;
  },

  getGamesWon: function() {
    return won;
  },

  getGamesPlayed: function() {
    return played;
  },

  getSettingsMsg: function() {
    return settingsMsg;
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

GridStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case Constants.MAKE_MOVE:
      makeMove(action.x, action.y);
      break;

    case Constants.MARK_MINE:
      if (winner === 0)
        markMine(action.x, action.y);
      break;

    case Constants.OPEN_AROUND:
      if (winner === 0) {
        var marks = countMarks(action.x, action.y);
        var number = cells[action.x][action.y].number;
        if (number > 0 && number === marks)
          openAround(action.x, action.y);
      }
      break;

    case Constants.NEW_GAME:
      if (started) played++;
      initialize();
      break;

    case Constants.SETTINGS:
      if (action.size === size && action.mines === mines) break;
      if (action.size > 40 || action.size < 10) 
        settingsMsg = 'Invalid size.';
      else if (action.mines < 10 || action.mines >= action.size*action.size)
        settingsMsg = 'Invalid number of mines.';
      else {
        won = 0;
        played = 0;
        size = action.size;
        numMines = action.mines;
        initialize();
      }
      break;

    default:
      return true;
  }

  GridStore.emitChange();

  return true;
});

module.exports = GridStore;