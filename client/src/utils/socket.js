import io from 'socket.io-client';
let host = location.origin;
console.log(host, '本机')
const socket = io.connect('https://192.168.63.58:9000');
export default socket;
