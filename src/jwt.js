import jwt from 'jsonwebtoken';

const secret = '65sd4f6s51f6g1a6df1a6df51';

export default {
    write: (room) => {
        const token = jwt.sign(room, secret);
        return token;
    },
    read: async (token) => {
        const room = await jwt.verify(token, secret);
        return room;
    }
}