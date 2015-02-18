/**
 * @jsx React.DOM
 */
var React = require('react');
var Actions = require('../actions/Actions');
 
var Cell = React.createClass({
 
 	move: function(event) {
 		event.preventDefault();
 		Actions.move(this.props.i, this.props.j);
 	},

 	getClassName: function() {
 		var i = this.props.i;
 		var j = this.props.j;
 		if( i === 0 ) {
 			if( j === 0 ) {
 				return "upper_left";
 			}
 			else if( j === 17 ) {
 				return "upper_right";
 			}
 			else {
 				return "upper_edge";
 			}
 		}
 		else if( i === 17 ) {
 			if( j === 0 ) {
 				return "lower_left";
 			}
 			else if( j === 17) {
 				return "lower_right";
 			}
 			else {
 				return "lower_edge";
 			}
 		}
 		else if( j === 0 ) {
 			return "left_edge";
 		}
 		else if( j === 17) {
 			return "right_edge";
 		}
 		else return "full_square";
 	},	

 	render: function() {
 		switch( this.props.cell ) {
 			case 1:
 				// var color = "#000000";
		 		var piece = (
 					<div className="white piece"></div>
 				);
 				break;
 			case 2:
 				// var color = "#FFFFFF";
 				var piece = (
 					<div className="black piece"></div>
 				);
 				break;
 		}
 		return (
 			<div className={"grid_square "+this.getClassName()} onClick={this.move}>
 				{piece}
 			</div>
 		);
 	}
 
});
 
module.exports = Cell;