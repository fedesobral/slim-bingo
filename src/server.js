import sirv from 'sirv';
import polka from 'polka';
import http from 'http';
import { json } from 'body-parser';
import compression from 'compression';
import io from 'socket.io';
import * as sapper from '@sapper/server';
import { v4 as uuidv4 } from 'uuid';

const server = http.createServer();

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka({ server }) // You can also use Express
	.use(
		// 'slim-bingo',
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		json(),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

// room
let rooms = {};
io(server
	// , {path: '/slim-bingo/socket.io'} 
).on('connection', socket => {
	let added = false;

	socket.on('pop ball', ({ ball }) => {
		const { room } = socket;
		console.log('pop', room, ball);
		const {pops} = rooms[room];
		if(pops) pops.push(ball);
		socket.to(room).emit('pop ball', {
			ball
		});
	});

	socket.on('reset balls', () => {
		const { room } = socket;
		console.log('reset', room);
		if(rooms[room]) rooms[room].pops = [];
		socket.to(room).emit('reset balls');
	});

	socket.on('declare winner', ({ winner }) => {
		const { room } = socket;
		socket.to(room).emit('declare winner', {
			winner
		});
	});

	// when the client emits 'add user', this listens and executes
	socket.on('add user', ({ username, room }) => {
		if (added) return;
		console.log('join', room, username);
		
		const userId = uuidv4();
		socket.userId = userId;
		socket.username = username;
		socket.room = room;
		socket.join(room);

		if(!rooms[room])rooms[room] = { pops: [], users: []}
		let { pops, users} = rooms[room];
		users.push({id: userId, name: username});

		added = true;
		socket.emit('login', { userId, pops, users });
		socket.in(room).emit('user joined', { username, userId });
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', () => {
		if (added) {
			const { room, username, userId } = socket;
			console.log('left', socket.room, username);
			if(rooms[room]){
				const {users} = rooms[room];
				const i = users.findIndex(e => e.id == userId);
				if(i>-1) users.splice(i, 1);
				if (users.length == 0) delete rooms[room];
			}
			// echo globally that this client has left
			socket.in(room).emit('user left', { userId, username });
		}
	});
});