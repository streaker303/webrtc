var app = require('express')();

fs = require('fs')
var options = {
	key: fs.readFileSync('./privatekey.pem'),
	ca: fs.readFileSync('./certrequest.csr'),
	cert: fs.readFileSync('./certificate.pem')
}
var server = require('https').Server(options, app);
var io = require('socket.io')(server,{
	cors: {
		origin: '*'
	}
});

server.listen(9000, ()=>{console.log('port 9000 is on')});

// app.get('/', function (req, res) {
// 	res.sendfile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
	console.log('连接成功')

	/*一对一*/
	socket.on('Server-ICE', function (data) {
		//console.log('ice-触发', data)
		socket.broadcast.emit('Client-ICE', data);
	});
	socket.on('Server-Offer', function (data) {
		//console.log('offer触发',data)
		socket.broadcast.emit('Client-Offer', data);
	});
	socket.on('Server-Answer', function (data) {
		//console.log('answer触发',data)
		socket.broadcast.emit('Client-Answer', data);
	});

	socket.on('disconnect', ()=>{
		socket.broadcast.emit('callEnded')
	})
});
