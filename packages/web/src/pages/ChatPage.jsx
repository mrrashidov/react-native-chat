import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const sendIcon = (
	<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path d='M19 10L1 1L5 10L1 19L19 10Z' stroke='black' strokeWidth='2' strokeLinejoin='round'/>
	</svg>
);

export const ChatPage = () => {
	const navigate = useNavigate();
	const { name } = useParams();

	const [ messages, setMessages ] = useState([]);

	const ws = useRef();

	const [ messageBody, setMessageBody ] = useState('');

	const [ isConnectionOpen, setConnectionOpen ] = useState(false);

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:9000/echo');

		ws.current.onopen = () => {
			console.log('Connection opened!');
			setConnectionOpen(true);
		};
		ws.current.onmessage = (ev) => {
			const message = JSON.parse(ev.data);
			console.log('newData',message)
			setMessages((_messages) => [ ..._messages, message ]);
		};
		ws.current.onclose = (ev) => {
			if (ev.code === 4000) {
				navigate('/kicked', { state: { kickReason: ev.reason } });
			}
		};

		return () => {
			console.log('Cleaning up! 🧼');
			ws.current.close();
		};
	}, []);

	const send = () => {
		if (messageBody === '') return;
		ws.current.send(JSON.stringify({
			sender: {
				name: name,
				avatar: 'https://i.pravatar.cc/50?img=43'
			},
			body: messageBody
		}));
		setMessageBody('');
	};

	const scrollTarget = useRef(null);
	useEffect(() => {
		if (scrollTarget.current) {
			scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [ messages.length ]);
	return (
		<main className='chat-wrapper'>
			<header className='chat-header'>
				<h1>WebSocket chat room</h1>
			</header>

			<div className='chat-view-container'>
				{ messages.map((message) => (
					<article
						key={ message.sentAt }
						className={ 'message-container' + (message.sender.name === name ? ' own-message' : ' message') }>
						<header className='message-header'>
							<h4 className='message-sender'>{ message.sender.name === name ? 'You' : message.sender.name }</h4>
							<span className='message-time'>
								{ new Date(message.sentAt).toLocaleTimeString(undefined, { timeStyle: 'short' }) }
							</span>
						</header>
						<p className='message-body'>{ message.body }</p>

						{ (message.sender.name === name ? false :
								<figure className={ 'message-avatar' }>
									<img src={ message.sender.avatar } alt={message.sender.name}/>
								</figure>
						) }

					</article>
				)) }
				<div ref={ scrollTarget }/>
			</div>

			<footer className='message-input-container'>
				<p className='chatting-as'>You are chatting as “{ name }”</p>

				<div className='message-input-container-inner'>
					<input
						autoFocus
						aria-label='Type a message'
						placeholder='Type a message'
						type='text'
						autoComplete='off'

						value={ messageBody }
						onChange={ (e) => setMessageBody(e.target.value) }

						onKeyPress={ (e) => {
							if (e.key === 'Enter') send();
						} }
					/>

					<button
						aria-label='Send'
						className='icon-button'
						onClick={ send }
						disabled={ !isConnectionOpen }>
						{ sendIcon }
					</button>
				</div>
			</footer>
		</main>
	);
};
