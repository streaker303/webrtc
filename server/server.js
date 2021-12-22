var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server,{
	cors: {
		origin: '*'
	}
});

server.listen(8000, ()=>{console.log('port 8000 is on')});

// app.get('/', function (req, res) {
// 	res.sendfile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
	console.log('连接成功')

	socket.on('Server-ICE', function (data) {
		//console.log(data, 'ice');
		console.log('ice-触发', data)
		socket.broadcast.emit('Client-ICE', data);
	});
	socket.on('Server-Offer', function (data) {
		console.log('offer触发',data)
		//console.log(data, 'offer');
		socket.broadcast.emit('Client-Offer', data);
	});
	socket.on('Server-Answer', function (data) {
		console.log('answer触发',data)
		//console.log(data, 'answer');
		socket.broadcast.emit('Client-Answer', data);
	});

	socket.on('disconnect', ()=>{
		socket.broadcast.emit('callEnded')
	})
});
