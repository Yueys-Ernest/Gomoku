/**
 * @jsx React.DOM
 */

var React = require('react');
var Actions = require('../actions/Actions');
var GridStore = require('../stores/GridStore');
var Grid = require('../components/Grid.react');
var Settings = require('../components/Settings.react');

function getMineSweeper() {
  return {
    cells: GridStore.getAllCells(),
    mines: GridStore.getMines(),
    winner: GridStore.getWinner(),
    win: GridStore.getGamesWon(),
    total: GridStore.getGamesPlayed(),
    settingsMsg: GridStore.getSettingsMsg()
  };
}

var MineSweeper = React.createClass({
  
  _newGame: function() {
      Actions.newGame();
  },

  getInitialState: function() {
    return getMineSweeper();
  },

  componentDidMount: function() {
    GridStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GridStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getMineSweeper());
  },

  render: function() {
    var result;
    switch(this.state.winner) {
      case 1:
        result = 'You won this game!';
        break;
      case -1:
        result = 'You lost this game.';
        break;
      default:
        result = '';
    }

    var dimension = 32 * this.state.cells.length;
    var style = {width: dimension+'px'};
    var percentage = 'N/A';
    if (this.state.total > 0) percentage = (Math.floor(this.state.win*10000/this.state.total)/100).toString() + '%';
    return (
      <div>
        <h1>MineSweeper</h1>
        <p>Left click on unstepped cell: step on it.</p>
        <p>Right click on unstepped cell: mark as mine.</p>
        <p>Any click on stepped cell: step on surrounding cells.</p><br />
        <div style={style}>
          <Grid cells={this.state.cells} winner={this.state.winner}/><br />
          <button id="new_game" onClick={this._newGame}>New Game</button>
          <p>Current size: {this.state.cells.length}</p>
          <p>Mines left: {this.state.mines}.</p>
          <div id="statistics">
            <br />
            <h3>Game Stats</h3>
            <p>Games won: {this.state.win}</p>
            <p>Games played: {this.state.total}</p>
            <p>Winning rate: {percentage}</p>
          </div>
          <h3>{result}</h3>
        </div>
        <div id="settings">
          <Settings />
          <p id="settingsMsg">{this.state.settingsMsg}</p>
        </div>
      </div>
    );
  }

});

module.exports = MineSweeper;
