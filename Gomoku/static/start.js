/**
 * @jsx React.DOM
 */
var React = require('react');
var Gomoku = require('./components/Gomoku.react');
var socketHandler = require('./socketHandler');

React.renderComponent(
	<Gomoku />,
	document.getElementById('app')
);

socketHandler.init();