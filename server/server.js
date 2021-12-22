var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server,{
	cors: {
		origin: '*'
	}
});

server.listen(8000, ()=>{console.log('port on')});

// app.get('/', function (req, res) {
// 	res.sendfile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
	console.log('连接成功')
	socket.on('call', function (data) {
		console.log(data);
		socket.emit('news', { hello: 'world' });
	});
});
