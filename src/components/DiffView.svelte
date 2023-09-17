<script lang="ts">
  import { diffItems } from "../store";
  import Patcher from './Patcher.svelte'

  let showFileTree = true
  function toggleFileTree () {
    showFileTree = !showFileTree
  }
</script>

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
</style>
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

  <div id="viewer-control">
        <input id="left-right-ratio" type="range" min="0" max="1000" step="1" /><br />
      </div>
      <div id="object-viewer-wrapper" style="display: none;">
        <table id="object-viewer" />
      </div>
</div>
<div>
    Inspector
</div>