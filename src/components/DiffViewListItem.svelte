<script lang="ts">
  import { onMount, tick } from "svelte";
  import { type DiffItem, SidesOfDiff } from "../github";
  import { Box, MaxPat } from "../maxpat2svg";
  import Patcher from "./Patcher.svelte";
  import BoxLink from './BoxLink.svelte'
  import { type SelectEvent } from '../util'
  import { selecting, selected, diffItemIndex, showInspector } from '../store'

  export let item: DiffItem;

  let showSVG = !item.same;
  let div: Element
  let heading: Element
  let headingSub: Element
  let left: Patcher
  let right: Patcher

  function toggleSVG() {
    showSVG = !showSVG;
  }

  async function handleSelectEvent (evt: Event) {
    if ( !(evt instanceof CustomEvent) ) return
    if ( !( evt.detail.left || evt.detail.right) ) return
    showSVG = true
    $showInspector = true
    $selecting = true
    for ( const side of SidesOfDiff ) {
      delete $selected[side]
      const target = evt.detail[side]
      if ( !target ) continue
      if ( !target.dataset.parentPath ) continue
      if ( !target.dataset.boxId ) continue
      target.classList.add('selected')
      const connections = target.dataset.connections
      if ( connections ) {
        div.querySelectorAll(connections).forEach( el => {
          el.classList.add('selected-connected')
        })
      }

      //XXX: I don't remember why search item from root with parentPath at here...
      const maxpat = $diffItemIndex[target.dataset.parentPath].patchers[side]
      if ( maxpat ) {
        const box = maxpat.boxes[target.dataset.boxId]
        $selected[side] = box.box
      }
    }
  }

  function selectBox(evt: Event) {
    if ( !(evt instanceof CustomEvent )) return
console.log(evt.detail)
    // At first, unselect everything
    document.querySelectorAll('.selected').forEach( (el) => {
      el.classList.remove('selected')
    })
    document.querySelectorAll('.selected-connected').forEach( (el) => {
      el.classList.remove('selected-connected')
    })
    $selecting = true
    $showInspector = true
    const focus = evt.detail['right'] ? 'right' : 'left'
    for ( const side of SidesOfDiff ) {
      delete $selected[side]
      const box = evt.detail[side]
      if ( !box ) continue
      if ( !div ) continue
      const target = div.querySelector(`.patcher-${side} g[data-box-id="${box.id}"]`)
      if ( !target ) continue
      if ( !(target instanceof SVGElement ) ) continue
      if ( !target.dataset.parentPath ) continue
      if ( !target.dataset.boxId ) continue
      target.classList.add('selected')
      const connections = target.dataset.connections
      if ( connections ) {
        div.querySelectorAll(connections).forEach( el => {
          el.classList.add('selected-connected')
        })
      }

      $selected[side] = box.box

      if ( side === focus ) {
        setTimeout( () => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        }, 1)
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
{#if item.diff && item.diff.hasDifference}
  {#if item.diff.removed && item.diff.removed.length}
    {#each item.diff.removed as id}
        <BoxLink
          box={item?.patchers?.left?.boxes[id]}
          on:click-box-link={selectBox}
          type="removed" />
    {/each}
  {/if}
  {#if item.diff.modified && item.diff.modified.length}
    {#each item.diff.modified as id}
        <BoxLink
          box={item?.patchers?.right?.boxes[id]}
          on:click-box-link={selectBox}
          type="modified" />
    {/each}
  {/if}
  {#if item.diff.added && item.diff.added.length}
    {#each item.diff.added as id}
        <BoxLink
          box={item?.patchers?.right?.boxes[id]}
          on:click-box-link={selectBox}
          type="added" />
    {/each}
  {/if}
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
