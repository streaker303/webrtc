import io from 'socket.io-client';
let host = location.origin;
const socket = io.connect('https://10.18.3.89:8000');
export default socket;
