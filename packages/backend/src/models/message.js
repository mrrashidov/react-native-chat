const { db, responseChat, mergeById } = require("../helper");
module.exports = class Message {

	constructor(userId) {
		this.userId = parseInt(userId)
	}

	async getRooms(){
		const userChatRooms = await db.select('*')
			.from('chat_room_members')
			.where({user_id: this.userId });

		const chat_room_ids = userChatRooms.map(e => e.chat_room_id);
		const userId = this.userId
		const rooms = await db.select([ 'rm.*', 'users.name', 'users.avatar', 'users.status' ])
			.from(function () {
				this.select('user_id', 'chat_room_id').from('chat_room_members')
					.whereIn('chat_room_members.chat_room_id', chat_room_ids)
					.whereNot('chat_room_members.user_id', userId)
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

		return mergeById(chat_rooms, chats)
	}
	/**
	 *
	 * @returns {Promise}
	 * @param roomId String|Number
	 * @param limit String|Number
	 * @param offset String|Number
	 */
	async getRoom(roomId, limit = '100', offset = '0') {
		const room_id = parseInt(roomId)

		const roomUsers = await db.select([ 'chat_room_members.user_id', 'chat_room_members.chat_room_id', 'users.name', 'users.avatar' ])
			.from('chat_room_members')
			.where({
				chat_room_id: room_id
			}).leftJoin('users', 'users.id', 'chat_room_members.user_id')

		const messagesList = await db.select([ 'id', 'chat_room_id', 'product_id', 'user_id', 'message', 'created_at' ])
			.from('chats')
			.where({ chat_room_id: room_id })
			.orderBy('id', 'asc')
			.limit(parseInt(limit))
			.offset(parseInt(offset))

		return messagesList.map(message => {
			roomUsers.find(user => {
				if (user.user_id === message.user_id) {
					message.avatar = user.avatar
					message.name = user.name
				}
			})
			return responseChat(message)
		})
	}

	/**
	 *
	 * @param payload Object
	 * @returns {Promise}
	 */
	async setMessage(payload) {
		payload['senderId'] = this.userId
		payload['createdAt'] = new Date(Date.now())
		if (!payload.hasOwnProperty('roomId')) { //if roomId not
			await db.insert({ name: (new Date()).getTime().toString(36) })
				.into('chat_rooms')
				.then(async function (id) {
					payload['roomId'] = parseInt(id[0]) // set new roomId if room id not
					await db.insert([
						{
							chat_room_id: payload.roomId,
							user_id: payload.senderId,
							product_id: payload.productId,
							joined_at: new Date(Date.now()),
							is_owner: true
						},
						{
							chat_room_id: payload.roomId,
							user_id: payload.receiverId,
							product_id: payload.productId,
							joined_at: new Date(Date.now())
						}
					]).into('chat_room_members')
				});
		}
		const newMessage = await db.insert({
			chat_room_id: payload.roomId,
			product_id: payload.productId,
			message: payload.message,
			user_id: payload.senderId,
			created_at: payload.createdAt
		}).into('chats').then(async res => {
			return await db.select([ 'chats.id', 'chats.chat_room_id','chats.product_id', 'chats.user_id', 'chats.message', 'chats.created_at', 'users.name', 'users.avatar' ])
				.from('chats')
				.where('chats.id', res[0])
				.leftJoin('users', 'users.id', 'chats.user_id')
				.then(res => res[0]).catch(err => err)

		}).catch(err => err)
		return responseChat(newMessage)
	}
}

