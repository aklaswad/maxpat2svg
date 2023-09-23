<script lang="ts">
  import { onMount } from "svelte";
  import { type DiffItem, SidesOfDiff } from "../github";
  import { MaxPat } from "../maxpat2svg";
  import Patcher from "./Patcher.svelte";
  import { type SelectEvent } from '../util'
  import { selecting, selected, diffItemIndex, showInspector } from '../store'

  export let item: DiffItem;

  let showSVG = !item.same;
  let div: Element
  let heading: Element
  let headingSub: Element

  function toggleSVG() {
    showSVG = !showSVG;
  }

  async function handleSelectEvent (evt: Event) {
    if ( !(evt instanceof CustomEvent) ) return
    if ( !evt.detail.left && !evt.detail.right ) {
      $selecting = false
      $selected = { left: undefined, right: undefined }
      return
    }
    showSVG = true
    $showInspector = true
    $selecting = true
    for ( const side of SidesOfDiff ) {
      const target = evt.detail[side]
      console.log(target.dataset.parentPath, target.dataset.boxId)
      if ( !target.dataset.parentPath ) return
      if ( !target.dataset.boxId ) return
      const maxpat = $diffItemIndex[target.dataset.parentPath].patchers[side]
      if ( maxpat ) {
        const box = maxpat.boxes[target.dataset.boxId]
        $selected[side] = box
      }
    }
  }

  onMount( () => {
    if ( div ) {
      div.addEventListener("box-select", handleSelectEvent)
    }
    item.select = async () => {
      showSVG = true;
      (heading || headingSub)
        .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
    }
    return () => {
      delete item.select
      if ( div ) {
        div.removeEventListener("box-select", handleSelectEvent)
      }
    };

  });
</script>

{#if item.sub}
<h2 class="diff-title diff-subpatcher-title" id={item.path?.join('/')} bind:this={headingSub}>
  <button on:click={toggleSVG}>{#if showSVG}^{:else}v{/if}</button>
  {item.name}
  {#if item.same} (same){/if}
</h2>
{:else}
<h1 class="diff-title" id={item.path?.join('/')} bind:this={heading}>
  <button on:click={toggleSVG}>{#if showSVG}^{:else}v{/if}</button>
  {item.name}
  {#if item.same} (same){/if}
</h1>
{/if}

<div class="patcher-wrapper" bind:this={div} class:hide={!showSVG}>
  <Patcher type="left" patcher={item.patchers.left} />
  <Patcher type="right" patcher={item.patchers.right} />
</div>

<style>
  .hide {
    display: none !important;
  }

  .diff-title {
    top: 0;
    box-sizing: border-box;
    width: 100%;
    height: 24px;
    text-align: left;
    margin: 4px 0;
    font-size: 1rem;
    background: #444;
    color: #fff;
    z-index: 10;
    scroll-margin-top: 30px;
  }

  h1.diff-title {
    z-index: 13;
  }

  h2.diff-title {
    z-index: 12;
  }

  .diff-title.diff-subpatcher-title {
    font-size: 0.8rem;
    background: #888;
    top: 24px;
  }

  .patcher-wrapper {
    border: 1px solid #000;
    position: relative;
    background: #f0f0f0;
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
  }
</style>
