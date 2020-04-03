<script>
  import {createCards} from '../cards.js';
  import { player, socket } from '../store.js';
  export let room = null;
  let name = "";

  const joinRoom = ev => {
    player.set({ id: '', name, creator: false, cards: createCards(room.cardsAmount) });
    socket.emit('add user', {username: $player.name, room: room.id});

    ev.stopPropagation();
    ev.preventDefault();
    return false;
  };
</script>

<style>
form{
  text-align: left;
}
</style>

<div class="main">
  <h1>Slim Bingo</h1>
  <p class="helpMessage">
    Join your friends in: 
    <b>{room.name}</b>
  </p>
  <form on:submit={joinRoom}>
    <label for="name">Player Name</label>
    <input
      id="name"
      bind:value={name}
      placeholder="Aragorn son of Arathorn, heir of Isildur"
      type="text" />
    <br />
    <input value="start" type="submit" />
    <div class="clearfix" />
  </form>
</div>
