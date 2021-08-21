const express = require("express")
const cors = require("cors")
const expressWs = require("express-ws")
const ws = expressWs(express());
const app = ws.app;
const Message = require("./Message");
const { mergeById, db } = require("./helper");
let connects = new Set();
let pingCount;

const sendMessage = async (message) => {
	const model = new Message(message.senderId)
	const response = await model.setMessage(message)

	for (const user of connects) {
		user.ws.send(JSON.stringify(response));
	}
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("home"));

app.ws('/echo', (ws, request) => {
	const userRef = { ws,lastActiveAt: Date.now() }
	connects.add(userRef);

	ws.on('message', async message => {
		try {
			await sendMessage(JSON.parse(message));
			userRef.lastActiveAt = Date.now();

		} catch (err) {
			console.error('Error parsing message!', err);
		}
	});

	ws.on('close', (code, reason) => {
		console.log(`User disconnected with code ${ code } and reason ${ reason }!`);
		connects.delete(userRef);
	});
});

app.get("/device", async (req, res) => {
	return res.status(200).json(true)
});

app.post("/device", async (req, res) => {
	return res.status(200).json(true)
});

app.post("/notification/send", async (req, res) => {
	return res.status(200).json(true)
});

app.get("/chat/:userId", async (req, res) => {

	pingCount++;
	const userChatRooms = await db.select('*')
		.from('chat_room_members')
		.where({
			user_id: parseInt(req.params.userId)
		})

	const chat_room_ids = userChatRooms.map(e => {
		return e.chat_room_id
	})

	const rooms = await db.select(['rm.*', 'users.name', 'users.avatar', 'users.status'])
		.from(function () {
			this.select('user_id', 'chat_room_id').from('chat_room_members')
				.whereIn('chat_room_members.chat_room_id', chat_room_ids)
				.whereNot('chat_room_members.user_id', parseInt(req.params.userId))
				.as('rm');
		}).leftJoin('users', 'users.id', 'rm.user_id')

	const chat_rooms = rooms.map(ur => {
		return {
			id: ur.chat_room_id,
			unseen: 0,
			user: {
				id: ur.user_id,
				name: ur.name,
				avatar: ur.avatar,
				status: ur.status,
			}
		}
	})
	let chats = []
	for (let i in userChatRooms) {
		await db.select('*')
			.from('chats')
			.where({
				chat_room_id: userChatRooms[parseInt(i)].chat_room_id
			})
			.orderBy('id', 'desc')
			.first()
			.then(res => chats.push({
				id: res.chat_room_id,
				message: res.message
			}))
	}
	return res.status(200).json(mergeById(chat_rooms, chats))
});

app.get("/chat/:userId/:roomId/message", async (req, res) => {
	pingCount++;
	const messages = new Message(req.params.userId)
	console.log('get-rooms', pingCount)
	return res.status(200).json(await messages.getRoom(req.params.roomId))
});

app.post("/chat/:userId/message", async (req, res) => {
	pingCount++;
	const messages = new Message(req.params.userId)
	console.log('send-message', pingCount)

	return res.status(200).json(await messages.setMessage(req.body))
});


setInterval(() => {
	const now = Date.now();

	for (const user of connects) {
		if (user.lastActiveAt < now - 300000) {
			user.ws.close(4000, 'inactivity');
		}
	}
}, 10000);


const PORT = 9000;
app.listen(PORT, () => console.warn(`Server started on port ${ PORT }`));
