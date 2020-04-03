import { writable } from "svelte/store";
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  'sync disconnect on unload': true,
  // path: '/slim-bingo/socket.io'
});

let player = writable(null);

let room = writable({
  id: '',
  name: '',
  cardsAmount: '',
  balls: null
});

export { player, room, socket }