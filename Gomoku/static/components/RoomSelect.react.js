/**
 * @jsx React.DOM
 */
var React = require('react');
var socketHandler = require('../socketHandler');

var RoomSelect = React.createClass({

	_handle_submit: function(event) {
		event.preventDefault();
		var room = document.getElementById('room_selection').value;
		socketHandler.connectRoom(room);
	},

	render: function() {
		var options = [];

		for (var i = 0; i < this.props.max; i++) {
			options.push(
				<option value={i.toString()}>{i.toString()}</option>
			);
		};

		return (
			<footer>
				<form onSubmit={this._handle_submit}>
					<select id="room_selection">
						{options}
					</select>
					<button type="submit">Enter</button>
				</form>
			</footer>
		);
	}

});

module.exports = RoomSelect;