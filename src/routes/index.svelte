<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`balls.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { balls: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import { goto } from "@sapper/app";
  import { player, room, socket } from "../store.js";

  export let balls = [];

  let roomData = {
    name: "",
    balls: balls[0].id,
    cardsAmount: 2,
    isPlayer: true,
    playerName: ""
  };

  const createRoom = async ev => {
    ev.stopPropagation();
    ev.preventDefault();

    const res = await window.fetch("/room", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(roomData)
    });
    const data = await res.json();
    room.set({...roomData, id: data.id});

    if (res.status === 200) {
      player.set({...data.player,cards: []});
      socket.emit('add user', {username: $player.name, room: $room.id});
      goto(`/room/${data.token}`);
    }

    return false;
  };
</script>

<div class="main">
  <h1>Slim Bingo</h1>
  <p class="helpMessage">Create a new room to start plaing</p>
  <form on:submit={createRoom}>
    <label for="name">Room name</label>
    <input
      id="name"
      bind:value={roomData.name}
      placeholder="Adventure Time"
      type="text" />
    <label for="balls">Balls Set</label>
    <select id="balls" bind:value={roomData.balls}>
      {#each balls as item, i (item.slug)}
        <option value={item.slug}>{item.name}</option>
      {/each}
    </select>
    <label for="name">Cards amount</label>
    <input id="cardsAmount" bind:value={roomData.cardsAmount} type="number" />
    <label for="isPlayer">Want to play?</label>
    <input id="isPlayer" bind:checked={roomData.isPlayer} type="checkbox" />
    {#if roomData.isPlayer}
      <br />
      <label for="playerName">Player name</label>
      <input
        id="playerName"
        bind:value={roomData.playerName}
        placeholder="Aragorn son of Arathorn, heir of Isildur"
        type="text" />
    {/if}
    <br />
    <input value="start" type="submit" />
    <div class="clearfix" />
  </form>
</div>
