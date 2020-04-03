<script>
  import { socket } from "../store.js";
  export let admin = false;
  export let balls = [];
  export let pops = [];

  const size = Math.ceil(Math.sqrt(balls.length));

  socket.on("pop ball", ({ ball }) => {
    console.log("pop", ball);
    const b = balls.find(e => e.id == ball);
    pops = [b, ...pops];
  });
</script>

<style>
  #container {
    width: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(var(--size), 1fr);
    border-bottom: 1px solid var(--color1);
    border-right: 1px solid var(--color1);
  }
  #container > div {
    align-content: center;
    align-self: center;
    text-align: center;
    height: 100%;
    line-height: 1.9em;
    border-top: 1px solid var(--color1);
    border-left: 1px solid var(--color1);
  }
  .clickable > div {
    cursor: pointer;
  }
  .checked {
    background: var(--color1light);
  }

  .lastballs-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
  }

  .lastballs-container>div:last-child {
    margin: 0 0 .5em .5em;
  }
  .lastballs {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    height: 6em;
  }
  .lastballs > div {height: 1.5em;
    width: 1.5em;
    margin: .2em;
    flex-shrink: 0;
    font-size: 2.5em;
  }
  .lastballs > div:first-child { 
    font-size: 4em;
  }
</style>

<div class="lastballs-container">
  <label>Last balls</label>
  <div class="lastballs">
    {#each pops as ball, i (ball.id)}
      <div class="popedball">{ball.text}</div>
    {/each}
  </div>
  <div>{(pops.length&&pops[0].desc)||''}</div>
</div>
<div id="container" style="--size:{size}" class:clickable={admin}>
  {#each balls as ball, i (ball.id)}
    <div class:checked={ball.checked} title={ball.text}>{ball.text}</div>
  {/each}
</div>
