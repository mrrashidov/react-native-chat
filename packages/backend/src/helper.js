const Knex = require('knex');
const helper = Knex({
    client: 'mysql',
    connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "chat"
    }
});

function groupByKey(list, key, { omitKey = false }) {
    return list.reduce((hash, { [key]: value, ...rest }) => ({
        ...hash,
        [value]: (hash[value] || []).concat(omitKey ? { ...rest } : { [key]: value, ...rest })
    }), {})
}

function mergeById(a1, a2) {
    return a1.map(itm => ({
        ...a2.find((item) => (item.id === itm.id) && item),
        ...itm
    }))
}

function responseChat(chat) {
    return {
        id: chat.id,
        text: chat.message,
        createdAt: chat.created_at,
        user: {
            id: chat.user_id,
            name: chat.name,
            avatar: chat.avatar,
        }
    }
}
module.exports = {
    db: helper,
    mergeById,
    groupByKey,
    responseChat
}
