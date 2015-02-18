/**
 * @jsx React.DOM
 */

var React = require('react');
var Tile = require('../components/Tile.react');

var Grid = React.createClass({

  render: function() {
    var cells = this.props.cells;
    var tiles = [];
    for (var x = 0; x < cells.length; ++x) {
      for (var y = 0; y < cells[x].length; ++y) {
        tiles.push(<Tile cell={cells[x][y]} key={x + '_' + y} winner={this.props.winner}/>);
      }
    }

    var dimension = 32 * cells.length;
    var style = {height: dimension+'px', width: dimension+'px'};
    return (
      <div>
        <div id="grid" style={style}>
          {tiles}
        </div>
      </div>
    );
  }

});

module.exports = Grid;
