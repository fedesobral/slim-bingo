<script>
  export let cells = [];

  const cols = Math.ceil(cells.length / 2);

  const onClick = (cell, i) => {
    if (cell.id != -1) {
      cell.checked = !cell.checked;
      cells[i] = cell;
    }
  };
</script>

<style>
  #container {
    height: 8em;
    width: calc(100% - 2em);
    display: inline-grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    margin: 1em;
    border-bottom: 1px solid var(--color2);
    border-right: 1px solid var(--color2);
  }
  #container > div {
    align-content: center;
    align-self: center;
    text-align: center;
    height: 100%;
    line-height: 3.9em;
    border-top: 1px solid var(--color2);
    border-left: 1px solid var(--color2);
    cursor: pointer;
  }
  .disabled {
    background: var(--color2);
  }
  .checked {
    background: var(--color1light);
  }
</style>

<div id="container" style="--cols:{cols}">
  {#each cells as cell, i (i)}
    <div
      class:disabled={cell.id == -1}
      class:checked={cell.checked}
      on:click={() => onClick(cell, i)}>
      {cell.text}
    </div>
  {/each}
</div>
