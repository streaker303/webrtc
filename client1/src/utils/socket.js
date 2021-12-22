import io from 'socket.io-client';
let host = location.origin;
const socket = io.connect('http://localhost:8000');
export default socket;
