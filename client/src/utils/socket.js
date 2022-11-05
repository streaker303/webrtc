import io from 'socket.io-client';
let host = location.origin;
console.log(location, '本机')
const socket = io.connect(`https://${location.hostname}:9000`);
export default socket;
