<script lang="ts">
  import { onMount, tick } from "svelte";
  import { type DiffItem, SidesOfDiff } from "../github";
  import { Box, MaxPat } from "../maxpat2svg";
  import Patcher from "./Patcher.svelte";
  import BoxLink from './BoxLink.svelte'
  import { type SelectEvent } from '../util'
  import { selecting, selected, selectedDiff, diffItemIndex, showInspector } from '../store'

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

  //XXX: To be moved to main App or store?
  function resetSelection () {
    document.querySelectorAll('.selected').forEach( (el) => {
      el.classList.remove('selected')
    })
    document.querySelectorAll('.selected-connected').forEach( (el) => {
      el.classList.remove('selected-connected')
    })
  }

  function _selectBox (boxes: { left?: Box, right?: Box }, targets: { left?: Element, right?: Element }) {
    resetSelection()
    const focus = targets['right'] ? 'right' : 'left'
    for ( const side of SidesOfDiff ) {
      delete $selected[side]
      const target = targets[side]
      const box = boxes[side]
      if ( !(target instanceof SVGElement) ) continue
      if ( !(box instanceof Box) ) continue
      $selecting = true
      $showInspector = true
      target.classList.add('selected')
      const connections = target.dataset.connections
      if ( connections ) {
        div.querySelectorAll(connections).forEach( el => {
          el.classList.add('selected-connected')
        })
      }
      $selected[side] = box
      $selectedDiff = item
      if ( side === focus ) {
        setTimeout( () => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        }, 1)
      }
    }
  }

  async function handleSelectEvent (evt: Event) {
    if ( !(evt instanceof CustomEvent) ) return
    if ( !( evt.detail.left || evt.detail.right) ) return
    showSVG = true
    $showInspector = true
    $selecting = true
    const boxes: {left?: Box, right?: Box} = {}
    for ( const side of SidesOfDiff ) {
      const target = evt.detail[side]
      if ( !target ) continue
      const maxpat = $diffItemIndex[target.dataset.parentPath].patchers[side]
      if ( maxpat ) {
        boxes[side] = maxpat.boxes[target.dataset.boxId]
      }
    }
    _selectBox(boxes, evt.detail)
  }

  function selectBox(evt: Event) {
    if ( !(evt instanceof CustomEvent )) return
    resetSelection()
    $selecting = true
    $showInspector = true
    selectByBox(evt.detail)
  }

  function selectByBox(boxes: {left?: Box, right?: Box}) {
    const targets: {left?: Element, right?: Element} = {}
    for ( const side of SidesOfDiff ) {
      const box = boxes[side]
      if ( !box ) continue
      if ( !div ) continue
      const target = div.querySelector(`.patcher-${side} g[data-box-id="${box.id}"]`) || undefined
      targets[side] = target
    }
    _selectBox(boxes, targets)
  }

  function selectOwner () {
    const parentPath = item.path?.slice(0, item.path.length - 1).join('/') || ''
    const parent = $diffItemIndex[parentPath]
    parent && parent.select && parent.select({
      left: parent.patchers.left?.boxes[item.id || ''],
      right: parent.patchers.right?.boxes[item.id || '']
    })
  }

  onMount( () => {
    if ( div ) {
      div.addEventListener("box-select", handleSelectEvent)
    }
    item.select = async (boxes?: {left?: Box, right?: Box}) => {
      showSVG = true;
      if ( boxes ) {
        selectByBox(boxes)
      }
      else {
        (heading || headingSub)
          .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
      }
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
  <button on:click|preventDefault|stopPropagation={selectOwner}>go to owner</button>
</h2>
{:else}
<h1 class="diff-title" id={item.path?.join('/')} bind:this={heading}>
  <button on:click={toggleSVG}>{#if showSVG}^{:else}v{/if}</button>
  {item.name}
  {#if item.same} (same){/if}
</h1>
{/if}
{#if item.diff && item.diff.status === 'modified'}
  {#if item.diff.boxes.removed && item.diff.boxes.removed.length}
    {#each item.diff.boxes.removed as id}
        <BoxLink
          left={item?.patchers?.left?.boxes[id]}
          on:click-box-link={selectBox}
          type="removed" />
    {/each}
  {/if}
  {#if item.diff.boxes.modified && item.diff.boxes.modified.length}
    {#each item.diff.boxes.modified as id}
        <BoxLink
          left={item?.patchers?.left?.boxes[id]}
          right={item?.patchers?.right?.boxes[id]}
          on:click-box-link={selectBox}
          type="modified" />
    {/each}
  {/if}
  {#if item.diff.boxes.added && item.diff.boxes.added.length}
    {#each item.diff.boxes.added as id}
        <BoxLink
          right={item?.patchers?.right?.boxes[id]}
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
