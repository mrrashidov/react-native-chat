// const express = require("express")
// const dotenv = require("dotenv")
// const cors = require("cors")
// const expressWs = require("express-ws")
// const ws = expressWs(express());
// const app = ws.app;
//
//
// dotenv.config({ path: "./config.env" });
// let connects = new Set();
// const recentMessages = [];
//
// const sendMessage = (message) => {
// 	for (const user of connects) {
// 		user.ws.send(JSON.stringify(message));
// 	}
// };
//
// app.ws('/echo', (ws, request) => {
// 	const userRef = { ws,lastActiveAt: Date.now() }
// 	connects.add(userRef);
//
// 	ws.on('message', message => {
// 		try {
// 			const parsedMessage = JSON.parse(message);
//
// 			console.log(parsedMessage)
// 			if (typeof parsedMessage.sender.name !== 'string' || typeof parsedMessage.sender.avatar !== 'string' || typeof parsedMessage.body !== 'string') {
// 				console.error('Invalid message received!', message);
// 				return;
// 			}
//
// 			const numberOfRecentMessages = recentMessages.filter((message) => message.sender.name === parsedMessage.sender.name).length;
// 			if (numberOfRecentMessages >= 10) {
// 				ws.close(4000, 'flooding the chat');
// 				return;
// 			}
//
// 			const verifiedMessage = {
// 				sender: parsedMessage.sender,
// 				body: parsedMessage.body,
// 				sentAt: Date.now(),
// 			}
// 			sendMessage(verifiedMessage);
// 			userRef.lastActiveAt = Date.now();
// 			recentMessages.push(verifiedMessage);
// 			setTimeout(() => recentMessages.shift(), 60000);
//
// 		} catch (err) {
// 			console.error('Error parsing message!', err);
// 		}
// 	});
//
// 	ws.on('close', (code, reason) => {
// 		console.log(`User disconnected with code ${ code } and reason ${ reason }!`);
// 		connects.delete(userRef);
// 	});
// });
//
// app.use(cors());
// app.use(express.json());
// app.use("/", require("./routes"));
// app.use("/chat", require("./routes/api/chat"));
//
//
// setInterval(() => {
// 	const now = Date.now();
//
// 	for (const user of connects) {
// 		if (user.lastActiveAt < now - 300000) {
// 			user.ws.close(4000, 'inactivity');
// 		}
// 	}
// }, 10000);
//
//
// const PORT = process.env.PORT || 6000;
// app.listen(PORT, () => console.warn(`Server started on port ${ PORT }`));
