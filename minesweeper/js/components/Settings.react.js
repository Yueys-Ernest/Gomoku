/**
 * @jsx React.DOM
 */

var React = require('react');
var Actions = require('../actions/Actions');

var Settings = React.createClass({
  _handle_submit: function(event) {
    event.preventDefault();
    var size = Math.floor(document.getElementById('size').value);
    var mines = Math.floor(document.getElementById('mines').value);
    Actions.changeSettings(size, mines); 
  },

  render: function() {
    return (
      <form onSubmit={this._handle_submit}>
        <button id="set" type="submit">Set</button>
        <h4>Settings</h4>
        Size:<input type="number" id="size" placeholder="Enter width/height (10 <= n <= 40)" /><br />
        Mines:<input type="number" id="mines" placeholder="Enter number of mines (10 <= m < size^2)" />
      </form>
    );
  }

});

module.exports = Settings;
