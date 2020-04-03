<script context="module">
  export async function preload({ params, query }) {
    let res = await this.fetch(`room/token/${params.token}`, {
      headers: { Accept: "application/json" }
    });
    const room = await res.json();
    res = await this.fetch(`balls/${room.balls}.json`);
    const balls = await res.json();

    if (res.status === 200) {
      return { room, balls: balls.dataSet };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import { onMount } from "svelte";
  import JoinRoom from "../../components/JoinRoom.svelte";
  import Balls from "../../components/Balls.svelte";
  import Card from "../../components/Card.svelte";
  import Invite from "../../components/Invite.svelte";
  import { player, room as roomData, socket } from "../../store.js";

  export let room = null;
  export let balls = [];
  let pops = [];
  let users = [];

  onMount(async () => {
    if (!room) {
      room = $roomData;
    }
    if (balls.length == 0) {
      const res = await window.fetch(`balls/${room.balls}.json`);
      const data = await res.json();

      if (res.status === 200) {
        balls = data.dataSet;
      }
    }
  });

  socket.on("user joined", ({ username, userId }) => {
    users[users.length] = { id: userId, name: username };
  });
  socket.on("user left", ({ username, userId }) => {
    const i = users.findIndex(e => e.id == userId);
    users.splice(i, 1);
    users = users;
  });
  if ($player && $player.creator) {
    if ($player.isPlayer) users[0] = { id: $player.id, name: $player.name };
  } else {
    socket.on("login", ({ userId, username, pops: popsList, users: usersList }) => {
      console.log(users);
      popsList.forEach(p => {
        $player.id = userId;
        const i = balls.findIndex(b => b.id == p);
        const ball = { ...balls[i], checked: true };
        balls[i] = ball;
        pops.push(ball);
      });
      pops = pops.reverse();
      users = usersList;
    });
    socket.on("pop ball", ({ ball }) => {
      console.log("pop", ball);
      const i = balls.findIndex(e => e.id == ball);
      balls[i] = { ...balls[i], checked: true };
    });
    socket.on("reset balls", () => {
      console.log("reset");
      balls.forEach(e => (e.checked = false));
      balls = balls;
    });
  }

  const onPop = () => {
    var index = -1;

    const canPop = !balls.reduce((a, e) => a && e.checked, true);
    if (canPop) {
      while (index == -1 || balls[index].checked) {
        index = Math.floor(Math.random() * Math.floor(99));
      }
      const ball = { ...balls[index], checked: true };
      balls[index] = ball;
      socket.emit("pop ball", { ball: ball.id });
      pops = [ball, ...pops];
    }
  };
  const onReset = () => {
    balls.forEach(e => (e.checked = false));
    balls = balls;
    socket.emit("reset balls");
  };
  const onInvite = () => {
    var dummy = document.createElement("input");

    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };
</script>

<style>
  .main.room {
    min-width: 40em;
    max-width: 62em;
    width: calc(100% - 4em);
  }

  .play-area {
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
  }
  .actions {
    display: flex;
    flex-direction: row;
  }
  .actions:last-child {
    margin-right: 0;
  }
  .balls {
    min-width: 20em;
    margin: 0 1.5em 3em 3em;
    flex: 1;
  }
  .users {
    width: 12em;
    margin-top: 2em;
  }
  .game {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 2em 2em 3em 1.5em;
    min-width: 18em;
    flex-grow: 2;
  }
  .game > label {
    margin-left: 1em;
  }
  .cards {
    margin-top: 3em;
  }
  .filler {
    flex: 1;
  }
  .reset {
    background: #e56399;
    box-shadow: 2px 2px #a74970;
  }
  .reset:active {
    background: #a74970;
  }
</style>

{#if !$player}
  <JoinRoom {room} />
{:else}

  <div class="main room">
    <h1>{room.name}</h1>
    <div class="play-area">
      <div class="balls">
        <div class="actions">
          <Invite />
          <div class="filler" />
          {#if $player.creator}
            <button on:click={onReset} class="reset">Reset</button>
            <button on:click={onPop}>Pop</button>
          {/if}
        </div>
        <Balls {balls} admin={true} pops={pops} />
      </div>
      <div class="users">
        <label>Users</label>
        <ul>
          {#each users as user, i (user.id)}
            <li>{user.name}</li>
          {/each}
        </ul>
      </div>
      {#if !$player.creator || $player.isPlayer}
        <div class="game" class:bigcards={!$player.creator}>
          <label>
            Playing as:
            <b>{$player.name}</b>
          </label>
          <div class="cards">
            {#each $player.cards as cells}
              <Card {cells} />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
