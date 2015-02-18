/**
 * @jsx React.DOM
 */
 var React = require('react');
 var Cell = require('./Cell.react');
 
 var Grid = React.createClass({

 	render: function() {
 		var board = this.props.board;
 		var cells = [];

 		for (var i = 0; i < board.length; i++) {
 			for (var j = 0; j < board[i].length; j++) {
 				cells.push(<Cell cell={board[i][j]} i={i} j={j} />)
 			};
 		};

 		return (
 			<div id="grid">
 				{cells}
 			</div>
 		);
 	}
 
 });
 
 module.exports = Grid;