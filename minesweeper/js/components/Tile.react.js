/**
 * @jsx React.DOM
 */

var React = require('react');

var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');

var Tile = React.createClass({

  _handleClick: function(event) {
    event.preventDefault();
    var cell = this.props.cell;
    if (!cell.open)
      Actions.makeMove(cell.x, cell.y);
    else
      Actions.openAround(cell.x, cell.y);
  },

  _markMine: function(event) {
    event.preventDefault();
    var cell = this.props.cell;
    if (!cell.open)
      Actions.markMine(cell.x, cell.y);
    else
      Actions.openAround(cell.x, cell.y);
  },

  render: function() {
    var cell = this.props.cell;
    var number = '';
    var className = 'tile';

    if (cell.open) {
      className += ' open';
      if (cell.mine) {
        number = 'X';
        className += ' mine';
        if (cell.hit) className += ' exploded';
      } else {
        if (cell.number > 0) number = cell.number.toString();
        className += (' no' + cell.number.toString());
      }
    }

    if (cell.mark) {
      number = 'M';
      if (this.props.winner === -1) {
        if (cell.mine) className += ' hit';
        else className += ' miss';
      }
    }

    return (
      <div className={className} onClick={this._handleClick} onContextMenu={this._markMine}>
        {number}
      </div>
    );
  }

});

module.exports = Tile;
