const { db } = require("../helper");
module.exports = new class Devices {

	async store(req) {
		return this.find(null, req.body.token).then(async device => {
			if (device.length > 0)
				return { ok: true }
			await db.insert({
				user_id: req.body.hasOwnProperty('userId') ? req.body.userId : 1,
				token: req.body.token,
				meta: JSON.stringify(req.headers)
			}).into('user_devices')
		})
	}

	async find(user_id, token = null) {
		return db.select('token')
			.from('user_devices')
			.where((queryBuilder) => {
				if (user_id)
					queryBuilder.where({ user_id })
				if (token)
					queryBuilder.orWhere({ token })
			})
	}
}
