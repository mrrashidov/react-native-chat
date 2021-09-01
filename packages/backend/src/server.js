const
	express = require('express'),
	cors = require('cors'),
	expressWs = require('express-ws'),
	Expo = require('expo-server-sdk'),
	ws = expressWs(express()),
	app = ws.app,
	Message = require('./models/message'),
	Device = require('./models/device'),
	connects = new Set();
let pingCount;

const sendMessage = async (message) => {
	const model = new Message(message.senderId);
	const response = await model.setMessage(message);

	await expoSender({
		user_id: parseInt(message.receiverId),
		title: "New Message",
		body: message.message.length > 15 ? message.message.substring(0, 15) : message.message,
		data: response
	})
	for (const user of connects) {
		user.ws.send(JSON.stringify(response));
	}
};

async function expoSender(payload) {

	if (payload.hasOwnProperty('body'))
		throw new Error('Body is required')
	if (payload.hasOwnProperty('title'))
		throw new Error('Title is required')
	let expo = new Expo({ accessToken: "token here" });

	const device = await Device.find(payload.user_id).then(res => res).catch(err => ({ errors: true, message: err, exception: { type: 'DATABASE_ERROR' } }));
	if (!device)
		return {
			errors: [ {
				message: 'Please access notification',
				code: 'VALIDATION_ERROR',
			} ],
		};
	const message = {
		to: device,
		sound: 'default',
		body: payload.body,
		title: payload.title,
		data: payload.data,
	}
	await expo.sendPushNotificationsAsync([message]);

}

app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => res.status(200).json({ ok:true,message:"Hello Ping" }))

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

app.post('/device', async (req, res) => {
	return await Device.store(req).then(() => res.status(200).json({ ok: true }))
		.catch((err) => res.status(500).json({ errors: true, message: err, exception: { type: 'DATABASE_ERROR' } }))
});

app.post('/push/send', async (req, res) => {
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
	const messages = new Message(req.params.userId);
	console.log('get-contact', pingCount);
	return res.status(200).json(await messages.getRooms());
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
