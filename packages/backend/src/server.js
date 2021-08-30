const
	express = require('express'),
	cors = require('cors'),
	expressWs = require('express-ws'),
	fetch = require('node-fetch'),
	bodyParser = require('body-parser'),
	ws = expressWs(express()),
	app = ws.app,
	Message = require('./Message'),
	{ mergeById, db } = require('./helper'),
	connects = new Set();
let pingCount;

const sendMessage = async (message) => {
	const model = new Message(message.senderId);
	const response = await model.setMessage(message);

	await expoSender({
		user_id: parseInt(message.receiverId),
		title: "New Message",
		body: "You have New message",
		data: response
	}).then(res => console.log('messageSender',res))
	for (const user of connects) {
		user.ws.send(JSON.stringify(response));
	}
};

async function expoSender(payload) {

	const device = await db.select('token')
		.from('user_devices')
		.where({ user_id: payload.user_id }).then(res => {
			if (res.length > 0)
				return res[0];
			return false;
		}).catch(err => res.status(500).json({
			errors: true,
			message: err,
			exception: { type: 'DATABASE_ERROR' },
		}));

	if (!device)
		return {
			errors: [ {
				message: 'Please access notification',
				code: 'VALIDATION_ERROR',
			} ],
		};
	payload.to = device.token;

	return await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})
		.then(res => res.json())
		.then(json => json)
		.catch(err => err);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('home'));

app.ws('/echo', (ws, request) => {
	const userRef = { ws, lastActiveAt: Date.now() };
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

app.get('/device', async (req, res) => {
	return res.status(200).json(true);
});

app.post('/device', async (req, res) => {
	return await db.select('token')
		.from('user_devices')
		.where({ token: req.body.token })
		.then(async (response) => {
			if (response.length > 0) {
				return res.status(200).json({ ok: true });
			}
			return await db.insert({
				user_id: 1,
				token: req.body.token,
				meta: JSON.stringify(req.headers),
			}).into('user_devices')
				.then(() => res.status(200).json({ ok: true }))
				.catch((err) => {
					console.log(err);
					res.status(500).json({
						errors: true,
						message: err,
						exception: { type: 'DATABASE_ERROR' },
					});
				});
		});
});

app.post('/notification/send', async (req, res) => {
	const errorBuilder = (message) => res.status(422).json({
		errors: true,
		message,
		exception: { type: 'VALIDATION_ERROR' },
	});
	if (!req.body.hasOwnProperty('user_id'))
		return errorBuilder('user_id required');
	if (!req.body.hasOwnProperty('title'))
		return errorBuilder('title required');
	if (!req.body.hasOwnProperty('body'))
		return errorBuilder('body required');
	if (!req.body.hasOwnProperty('data'))
		return errorBuilder('data required');
	if (!req.body.hasOwnProperty('sound'))
		req.body.sound = 'default';

	return await expoSender(req.body).then(response => {
		if (response.errors) {
			return res.status(422).json({
				errors: true,
				message: response.errors[0].message,
				exception: {
					type: response.errors[0].code,
				},
			});
		}
		return res.status(200).json(response.data);
	});

});

app.get('/chat/:userId', async (req, res) => {

	pingCount++;
	const userChatRooms = await db.select('*')
		.from('chat_room_members')
		.where({
			user_id: parseInt(req.params.userId),
		});

	const chat_room_ids = userChatRooms.map(e => {
		return e.chat_room_id;
	});

	const rooms = await db.select([ 'rm.*', 'users.name', 'users.avatar', 'users.status' ])
		.from(function() {
			this.select('user_id', 'chat_room_id').from('chat_room_members')
				.whereIn('chat_room_members.chat_room_id', chat_room_ids)
				.whereNot('chat_room_members.user_id', parseInt(req.params.userId))
				.as('rm');
		}).leftJoin('users', 'users.id', 'rm.user_id');

	const chat_rooms = rooms.map(ur => {
		return {
			id: ur.chat_room_id,
			unseen: 0,
			user: {
				id: ur.user_id,
				name: ur.name,
				avatar: ur.avatar,
				status: ur.status,
			},
		};
	});
	let chats = [];
	for (let i in userChatRooms) {
		await db.select('*')
			.from('chats')
			.where({
				chat_room_id: userChatRooms[parseInt(i)].chat_room_id,
			})
			.orderBy('id', 'desc')
			.first()
			.then(res => chats.push({
				id: res.chat_room_id,
				message: res.message,
			}));
	}
	return res.status(200).json(mergeById(chat_rooms, chats));
});

app.get('/chat/:userId/:roomId/message', async (req, res) => {
	pingCount++;
	const messages = new Message(req.params.userId);
	console.log('get-rooms', pingCount);
	return res.status(200).json(await messages.getRoom(req.params.roomId));
});

app.post('/chat/:userId/message', async (req, res) => {
	pingCount++;
	const messages = new Message(req.params.userId);
	console.log('send-message', pingCount);

	return res.status(200).json(await messages.setMessage(req.body));
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
