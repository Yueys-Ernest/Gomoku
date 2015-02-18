/**
 * @jsx React.DOM
 */
var React = require('react');

var InfoPanel = React.createClass({

	render: function() {
		var game_state = (this.props.running) ? 'is running' : 'is not running';
		var request, result, stats = '';

		switch(this.props.request) {
			case -2:
				request = 'You requested to undo';
				break;
			case -1:
				request = 'You requested to restart';
				break;
			case 2:
				request = 'Opponent requested to undo';
				break;
			case 1:
				request = 'Opponent requested to restart';
				break;
			case 4:
				request = 'A player requested to undo';
				break;
			case 3:
				request = 'A player requested to restart';
				break;
			default:
				request = '';
		}

		switch(this.props.result) {
			case 1:
				result = 'You won this game!';
				break;
			case -1:
				result = 'You lost this game.';
				break;
			default:
				result = '';
		}

		if (this.props.win + this.props.loss > 0)
			stats = 'Stats: '+this.props.win+' wins, '+this.props.loss+' losses, 0 draws';
		
		return (
			<div>
				<p>Game {game_state}</p>
				<p>{stats}</p>
				<p>{result}</p>
				<p>{request}</p>
			</div>
		);
	}

});

module.exports = InfoPanel;