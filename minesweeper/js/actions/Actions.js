var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var TodoActions = {

  makeMove: function(x, y) {
    AppDispatcher.handleViewAction({
      actionType: Constants.MAKE_MOVE,
      x: x,
      y: y
    });
  },

  markMine: function(x, y) {
    AppDispatcher.handleViewAction({
      actionType: Constants.MARK_MINE,
      x: x,
      y: y
    });
  },

  openAround: function(x, y) {
    AppDispatcher.handleViewAction({
      actionType: Constants.OPEN_AROUND,
      x: x,
      y: y
    });
  },

  newGame: function() {
    AppDispatcher.handleViewAction({
      actionType: Constants.NEW_GAME
    });
  },

  changeSettings: function(size, mines) {
    AppDispatcher.handleViewAction({
      actionType: Constants.SETTINGS,
      size: size,
      mines: mines
    });
  },

};

module.exports = TodoActions;
