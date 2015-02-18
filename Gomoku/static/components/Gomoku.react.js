/**
 * @jsx React.DOM
 */
var React = require('react');
var BoardStore = require('../stores/BoardStore');
var Grid = require('./Grid.react');
var RoomSelect = require('./RoomSelect.react');
var InfoPanel = require('./InfoPanel.react');
var Actions = require('../actions/Actions');

function getState() {
	return {
		board: BoardStore.getBoard(),
		max_room: BoardStore.getMaxRoom(),
		running: BoardStore.isRunning(),
		result: BoardStore.winOrLose(),
		request: BoardStore.requestStatus(),
		buttonsEnabled: BoardStore.buttonsEnabled(),
		win: BoardStore.getWin(),
		loss: BoardStore.getLoss()
	};
}

var Gomoku = React.createClass({

	getInitialState: function() {
		return getState();
	},

	componentDidMount: function() {
		BoardStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		BoardStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getState());
	},

	_requestRestart: function() {
		Actions.request_restart();
	},

	_requestUndo: function() {
		Actions.request_undo();
	},

	render: function() {
		var restart_disabled = !this.state.buttonsEnabled || this.state.request === -1;
		var undo_disabled = !this.state.buttonsEnabled || this.state.request === -2;
		return (
			<div>
				<Grid board={this.state.board} />
				<h1></h1>
				<button onClick={this._requestRestart} disabled={restart_disabled}>Restart</button>
				<button onClick={this._requestUndo} disabled={undo_disabled}>Undo</button>
				<InfoPanel running={this.state.running} result={this.state.result} request={this.state.request} 
					win={this.state.win} loss={this.state.loss} />
				<RoomSelect max={this.state.max_room} />
			</div>
		);
	}

});

module.exports = Gomoku;