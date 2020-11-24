import { Socket } from "dgram";
import io from "socket.io-client";

const socket = io.connect("https://www.pollstr.app/", { transports: ["websocket"], });
// // const socket = io.connect('https://pollstr-app.herokuapp.com/api/', { transports: ['websocket'] });
// // const socket = io.connect('http://localhost:5000/', {transports: ['websocket']});
// // const socket = io.connect('https://pollstr.app/');
socket.on("connect", () => console.log("Socket-IO Client Connected"));

export const ensureConnection = () => {
	console.log("Ensuring Server Hook");
	if (socket) {
		if (socket.disconnected) {
			console.log("Reconnecting to Server");
			socket.connect();
		} else console.log("Server is Connected");
	}
	console.log("Cannot Reconnect to Server!");
};

export default socket;