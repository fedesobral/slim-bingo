import jwt from '../../jwt.js';
import { v4 as uuidv4 } from 'uuid';

export function post(req, res) {
    const { isPlayer, playerName, ...room } = req.body;

    room.id = uuidv4();
    const player = { name: playerName, isPlayer, creator: true };
    const token = jwt.write(room);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({player, token, id: room.id}));
}