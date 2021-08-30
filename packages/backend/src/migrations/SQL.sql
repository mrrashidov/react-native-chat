create table users
(
    id         bigint unsigned auto_increment primary key,
    name       varchar(255) null,
    username   varchar(255) null,
    avatar     varchar(255) null,
    status     varchar(255) null,
    preference json         null,
    created_at timestamp    null,
    updated_at timestamp    null,
    constraint users_username_unique
        unique (username)
)
    collate = utf8mb4_unicode_ci;



create table chat_rooms
(
    id                   bigint unsigned auto_increment primary key,
    name                 varchar(255) null,
    last_conversation_at datetime     null,
    meta                 json         null,
    created_at           timestamp    null,
    updated_at           timestamp    null
)
    collate = utf8mb4_unicode_ci;

create table chat_room_members
(
    id           bigint unsigned auto_increment primary key,
    chat_room_id bigint unsigned      null,
    user_id      bigint unsigned      null,
    joined_at    datetime             null,
    left_at      datetime             null,
    is_owner     tinyint(1) default 0 not null,
    is_moderator tinyint(1) default 0 not null,
    meta         json                 null,
    created_at   timestamp            null,
    updated_at   timestamp            null,
    constraint chat_room_members_chat_room_id_foreign
        foreign key (chat_room_id) references chat_rooms (id)
            on delete cascade,
    constraint chat_room_members_user_id_foreign
        foreign key (user_id) references users (id)
            on delete cascade
)
    collate = utf8mb4_unicode_ci;

create table chats
(
	id           bigint unsigned auto_increment primary key,
	chat_room_id bigint unsigned null,
	user_id      bigint unsigned null,
	product_id   bigint  not  null,
	message      longtext        null,
	meta         json            null,
	created_at   timestamp       null,
	updated_at   timestamp       null,
	constraint chats_chat_room_id_foreign
		foreign key (chat_room_id) references chat_rooms (id)
			on delete cascade,
	constraint chats_user_id_foreign
		foreign key (user_id) references users (id)
			on delete cascade
)
	collate = utf8mb4_unicode_ci;


create table user_devices
(
	id            bigint unsigned auto_increment primary key,
	user_id       bigint  not  null,
	token         varchar(50)  unique not null,
	meta          json         not null,
	created_at    timestamp    default current_timestamp
)
	collate = utf8mb4_unicode_ci;




INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Jenny Doe', 'jenny', 'https://randomuser.me/api/portraits/women/77.jpg', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('John Doe', 'john', 'https://randomuser.me/api/portraits/men/84.jpg', 'offline', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Ken William', 'ken', 'https://randomuser.me/api/portraits/men/3.jpg', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Selina Paul', 'selina','https://randomuser.me/api/portraits/women/72.jpg', 'offline', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Christy Alex', 'christy','https://randomuser.me/api/portraits/men/60.jpg', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Tim Doe', 'tim','https://steamavatar.io/img/14777415234R5R3.jpg', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Sal Robertson','sal', 'https://steamavatar.io/img/1477396948h8mEw.jpg', 'offline', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Miguel Tomas', 'miguel','https://steamavatar.io/img/1477787598WaEcb.jpg', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Mauro John', 'mauro','https://steamavatar.io/img/14777876913ohHt.jpg', 'offline', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Bridgett Carol', 'bridgett','https://steamavatar.io/img/1477787681h5eyX.png', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Zenia Jacobs', 'zenia','https://steamavatar.io/img/1477787687fbJ8u.jpg', 'online', NULL, CURRENT_TIMESTAMP);
INSERT INTO chat.users (name, username, avatar, status, preference, created_at)
VALUES ('Felecia Rower', 'rower','https://steamavatar.io/img/1477351894QTysS.jpg', 'offline', NULL, CURRENT_TIMESTAMP);
