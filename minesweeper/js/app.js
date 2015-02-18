/**
 * @jsx React.DOM
 */

var React = require('react');

var MineSweeper = require('./components/MineSweeper.react');

React.renderComponent(
  <MineSweeper />,
  document.getElementById('app')
);
