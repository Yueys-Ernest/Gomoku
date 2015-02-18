var express = require('express');
var app = express();
var server = require('http').Server(app);
server.listen(8000);
var io = require('socket.io')(server);
var polyfill = require('./static/util/polyfills');

app.use('/', express.static(__dirname + '/static'));

io.on('connection', function(socket) {
	socket.emit('rooms', max_games);
});

var max_games = 10;
var games = new Array(max_games);

function initialize(room) {

	games[room] = {};

	function reset_game() {
			//	board initialization
			games[room]['board'] = [];
			for (var j = 0; j < 18; j++) {
				games[room]['board'].push((new Array(18)).fill(0));
			};
			//	Meta info
			games[room]['player_count'] = 0;
			games[room]['turn'] = 1;
			games[room]['winner'] = 0;
			games[room]['restart_req_count'] = 0;
			games[room]['undo_req_count'] = 0;
			games[room]['moves'] = [];
	};
	reset_game();

	//	Set up socket io
	games[room]['socket'] = io.of('/' + room.toString()).on('connection', function(socket) {

		//	Wait until enough players
		games[room]['player_count'] += 1;
		if( games[room]['player_count'] === 1 ) {
			socket.emit('wait');
			console.log('Room '+room+': '+'1 player ready')
		}
		else if( games[room]['player_count'] === 2 ) {
			games[room]['socket'].emit('start_game');
			console.log('Room '+room+': '+'2 players ready. Game start!')
		}
		else {
			socket.emit('game_status', games[room]['board']);
			console.log('Room '+room+': '+'Watcher came in');
		}
		//	Action should be an object containing fields:
		//	i:  1st index
		//  j:  2nd index
		//  player:  player making the action 
		socket.on('move', function(action) {
			if( games[room]['player_count'] < 2 ) return;
			var i = action.i;
			var j = action.j;
			var player = action.player;
			if( player !== games[room]['turn'] || games[room]['board'][i][j] !== 0 ) {
				//	Do nothing if out of turn or place taken up.
				return;
			}
			games[room]['board'][i][j] = player;
			games[room]['turn'] = ((games[room]['turn'] === 1) ? 2 : 1);	//	Switch turn
			games[room]['socket'].emit('move_made', {
				i: i,
				j: j,
				player: player
			});
			games[room]['restart_req_count'] = 0;
			games[room]['undo_req_count'] = 0;
			games[room]['moves'].unshift({i: i, j: j, player: player});
			var won = checkWin(i, j, player, room);
			if( won ) {
				games[room]['winner'] = player;
				games[room]['socket'].emit('win', player);
			}
		});

		socket.on('disconnect', function() {
			games[room]['player_count'] -= 1;
			console.log('Room '+room+': '+'remaining: ' + games[room]['player_count'])
			if( games[room]['player_count'] === 0 ) {
				reset_game();
				console.log('Room '+room+': '+'reset game')
			}
		});

		socket.on('request_restart', function() {
			games[room]['restart_req_count']++;
			if (games[room]['restart_req_count'] == 1)
				games[room]['socket'].emit('request_status', 1);
			else if (games[room]['restart_req_count'] == 2) {
				console.log('Room '+room+': '+'restarting the game');
				var player_count = games[room]['player_count'];
				reset_game();
				games[room]['player_count'] = player_count;
				games[room]['socket'].emit('restart');
			}
		});

		socket.on('request_undo', function() {
			games[room]['undo_req_count']++;
			if (games[room]['undo_req_count'] == 1)
				games[room]['socket'].emit('request_status', 2);
			else if (games[room]['undo_req_count'] == 2) {
				console.log('Room '+room+': '+'undoing one move');
				var move = games[room]['moves'][0];
				games[room]['socket'].emit('undo', {
					i: move.i,
					j: move.j,
					player: move.player
				});
				games[room]['board'][move.i][move.j] = 0;
				games[room]['turn'] = move.player;
				games[room]['moves'].splice(0,1);
				games[room]['undo_req_count'] = 0;
				games[room]['winner'] = 0;
			}
		});

	});
}

for (var i = 0; i < max_games; i++) {
	initialize(i);
};

//suppose to run after a player click on board
//return 1: player win
//return 2: haven't win
function checkWin(i, j, player, room){
	var winner = player;
	var iCopy = i;
	for(var minus=0 ; minus<5 ; minus++)
	{
		iCopy = i - minus;
		if(iCopy < 0)
			break;

		winner = player;
		for(var start=0;start<5;start++)
		{
			if(iCopy+start >=18  ||  games[room]['board'][iCopy+start][j]!=player)
			{
				winner=-1;
				break;
			}
		}
		if(winner==player)
			return 1;
	}

	var jCopy = j;
	for(minus=0;minus<5;minus++)
	{
		jCopy = j - minus;
		if(jCopy < 0)
			break;

		winner = player;
		for(var start=0;start<5;start++)
		{
			if(jCopy+start >=18  ||  games[room]['board'][i][jCopy+start]!=player)
			{
				winner=-1;
				break;
			}
		}
		if(winner==player)
			return 1;
	}

	//minus means the start point will go left up
	var iCopy_minus = i;
	var jCopy_minus = j;
	for(minus=0;minus<5;minus++)
	{
		iCopy_minus = i - minus;
		jCopy_minus = j - minus;
		if(iCopy_minus < 0  ||  jCopy_minus < 0)
			break;

		winner = player;
		for(var start=0;start<5;start++)
		{
			if(iCopy_minus+start >=18 || jCopy_minus+start >=18 ||  
				games[room]['board'][iCopy_minus+start][jCopy_minus+start]!=player)
			{
				winner=-1;
				break;
			}
		}
		if(winner==player)
			return 1;
	}

	var iCopy_plus = i;
	var jCopy_plus = j;
	for(var minus=0;minus<5;minus++)
	{
		iCopy_plus = i + minus;
		jCopy_plus = j - minus;
		if(iCopy_plus >=18  ||  jCopy_plus < 0)
			break;

		winner = player;
		for(var start=0;start<5;start++)
		{
			if(iCopy_plus-start < 0 || jCopy_plus+start >=18 ||  
				games[room]['board'][iCopy_plus-start][jCopy_plus+start]!=player)
			{
				winner=-1;
				break;
			}
		}
		if(winner==player)
			return 1;
	}

	return 0;
}


