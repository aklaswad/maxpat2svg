<script lang="ts">
  import { diffItems, showInspector, opacityBalance } from "../store";
  import Patcher from './Patcher.svelte'
  import Inspector from './Inspector.svelte'

  let showFileTree = true
  function toggleFileTree () {
    showFileTree = !showFileTree
  }

  function toggleInspector () {
    $showInspector = !$showInspector
  }

</script>

<header>
  {#if showFileTree}
    <button on:click={toggleFileTree}>&lt;</button>
  {:else}
    <button on:click={toggleFileTree}>&gt;</button>
  {/if}
</header>
{#if showFileTree}
<div id="file-tree">
  <ul>
    {#each $diffItems as item}
      <li>{item.name}</li>
    {/each}

  </ul>
</div>
{/if}
<div id="content-wrapper" class:show-tree="{showFileTree}">
  {#each $diffItems as item}
    <div class="diff-wrapper">
      <h1 class="diff-title">{item.name}</h1>
      <div class="patcher-wrapper">
        <Patcher type="left" patcher={item.leftPatcher} />
        <Patcher type="right" patcher={item.rightPatcher} />
      </div>
    </div>
  {/each}
</div>
<div id="controls">
  <div id="viewer-control">
    <span>
      <span class="help-keybind">z</span> Old
    </span>

    <input id="left-right-ratio" type="range" min="0" max="1000" step="1" bind:value={$opacityBalance} />
    <span>
      New <span class="help-keybind">x</span>
    </span>
    <span>
      <button on:click={toggleInspector}>
      {#if $showInspector}
        hide inspector
      {:else}
        show inspector
      {/if}
    </span>
  </div>
  {#if $showInspector}
  <div id="inspector">
    <Inspector />
  </div>
  {/if}
</div>

<style>
  header {
    background-color: #ccc;
    position: sticky;
    height: 30px;
    top: 0;
    z-index: 10;
  }

  #content-wrapper {
    box-sizing: border-box;
    width: 100%;
    padding: 2px;
  }

  #content-wrapper.show-tree {
    padding: 2px 2px 2px 300px;
  }

  #file-tree {
    position: fixed;
    width: 300px;
    top: 30px;
    left: 0;
    background-color: #abc;
  }
  .diff-title {
    position: sticky;
    top: 30px;
  }

  .patcher-wrapper {
    position: relative;
  }

  #controls {
    position: fixed;
    width: 100vw;
    bottom: 0;
    z-index: 100;
  }

  #viewer-control {
    position: relative;
    top: 0;
    width: 300px;
    padding: 10px;
    margin: 0 0 10px 0;
    border: 1px solid #999;
    border-radius: 5px;
    left: calc(50vw - 150px);
    background: rgba(168, 170, 172, 0.8);
  }

  #inspector {
    background: #ddd;
    height: min(400px, 50vh);
  }
</style>
