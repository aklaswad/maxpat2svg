<script lang="ts">
  import { onMount } from "svelte";
  import { diffItemTree, showInspector, opacityBalance, selecting, selected } from "../store";
  import DiffViewList from './DiffViewList.svelte'
  import TheInspector from './TheInspector.svelte'
  import TheFileTree from './TheFileTree.svelte'
  import { type SelectEvent } from "../util";
  import type { SideOfDiff } from "../github";

  let contents: Element
  let showFileTree = true

  function toggleFileTree () {
    showFileTree = !showFileTree
  }

  function handleDiffViewClick(evt: MouseEvent) {

    // At first, unselect everything
    document.querySelectorAll('.selected').forEach( (el) => {
      el.classList.remove('selected')
    })
    document.querySelectorAll('.selected-connected').forEach( (el) => {
      el.classList.remove('selected-connected')
    })
    $selecting = false
    $selected = { left: undefined, right: undefined }
    $showInspector = false

    // Look for selected object and it's parent patcher
    const possibles = document.elementsFromPoint(evt.clientX, evt.clientY)
    const parentCandidates = possibles
      .filter(e => e.matches('.patcher-wrapper'))
    const parent = parentCandidates.length ? parentCandidates[0] : undefined
    if ( !parent ) return
    const leftCandidates = possibles
      .filter(e => e.parentElement && e.parentElement.matches('.patcher-left g.box'))
    const left = leftCandidates.length ? leftCandidates[0].parentElement : undefined
    const rightCandidates = possibles
      .filter(e => e.parentElement && e.parentElement.matches('.patcher-right g.box'))
    const right = rightCandidates.length ? rightCandidates[0].parentElement : undefined

    const detail: {[side in SideOfDiff]?: SVGElement} = {}
    const selectEvent
      = new CustomEvent('box-select', { bubbles: true, cancelable: true, detail })
    if ( left && left instanceof SVGElement ) { selectEvent.detail.left = left }
    if ( right && right instanceof SVGElement ) { selectEvent.detail.right = right }

    parent.dispatchEvent(selectEvent)
  }

  onMount( () => {
    contents.addEventListener('click', function (evt) {
      if ( evt instanceof MouseEvent ) {
        handleDiffViewClick(evt)
      }
    })
  })
</script>

<header>
  {#if showFileTree}
    <button on:click={toggleFileTree}>&lt;</button>
  {:else}
    <button on:click={toggleFileTree}>&gt;</button>
  {/if}
</header>

<div id="content-wrapper" class:show-tree="{showFileTree}" class:show-inspector="{$showInspector}">
  {#if showFileTree}
    <ul id="file-tree" class:show-inspector={$showInspector}>
      <TheFileTree nodes={$diffItemTree} />
    </ul>
  {/if}
  <div id="diff-content-wrapper" bind:this={contents}>
    <DiffViewList nodes={$diffItemTree} />
  </div>
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
  </div>
  {#if $showInspector}
  <div id="inspector">
    <TheInspector />
  </div>
  {/if}
</div>

<style>
  :root {
    --inspector-height: 400px;
    --header-height: 30px;
  }

  header {
    background-color: #333;
    position: fixed;
    height: var(--header-height);
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    overflow: hidden;
    box-sizing: border-box;
  }

  #content-wrapper {
    box-sizing: border-box;
    padding: 2px 2px 0 0;
    position: fixed;
    top: var(--header-height);
    left: 0;
    width: 100%;
    height: calc(100% - var(--header-height));
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 0;
    display: grid;
    grid-template-columns: 100%;
  }

  #content-wrapper.show-tree {
    padding: 2px 2px 0 0;
    grid-template-columns: 300px calc(100% - 300px);
  }

  #content-wrapper.show-inspector {
    height: calc(100% - min(var(--inspector-height), 50vh) - var(--header-height))
  }

  #file-tree {
    position: sticky;
    max-height: 100%;
    top: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 30;
    padding: 20px 4px 40px 4px;
    box-sizing: border-box;
    align-self: start;
  }

  #file-tree.show-inspector {
    max-height: calc(100vh - min(var(--inspector-height), 50vh) - var(--header-height))
  }

  #diff-content-wrapper {
    box-sizing: border-box;
    padding: 12px 0 100px 0;
    display: block;
  }

  #controls {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 100;
  }

  #viewer-control {
    position: absolute;
    box-sizing: border-box;
    top: -60px;
    height: 40px;
    padding: 10px;
    margin: 0 0 10px 0;
    border: 1px solid #999;
    border-radius: 5px;
    left: calc(50vw - 150px);
    background: rgba(168, 170, 172, 0.8);
  }

  #inspector {
    height: min(var(--inspector-height), 50vh);
  }
</style>
