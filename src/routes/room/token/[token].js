import jwt from '../../../jwt.js';

export async function get(req, res) {
    const { token } = req.params;

    const room = await jwt.read(token);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(room));
}