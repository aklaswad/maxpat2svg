<script lang="ts">
  import { onMount, tick } from "svelte";
  import { type DiffItem } from "../github";
  import { MaxPat } from "../maxpat2svg";
  import Patcher from "./Patcher.svelte";
  import { type SelectEvent } from '../util'

  export let item: DiffItem;

  let showSVG = !item.same;
  let div: Element
  let heading: Element

  function toggleSVG() {
    showSVG = !showSVG;
  }

  async function handleSelectEvent (evt: SelectEvent) {
    showSVG = true
  }

  onMount( () => {
    if ( div ) {
      div.addEventListener("box-select", handleSelectEvent)
    }
    item.select = async () => {
      showSVG = true
      await tick;
      (div || heading).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    }
    return () => {
      delete item.select
      if ( div ) {
        div.removeEventListener("box-select", handleSelectEvent)
      }
    };

  });
</script>

<h1 class="diff-title" id={item.id} bind:this={heading}>
  <button on:click={toggleSVG}>{#if showSVG}^{:else}v{/if}</button>
  {item.name}
</h1>

{#if showSVG}
  <div class="diff-wrapper" bind:this={div}>
    <div class="patcher-wrapper">
      <Patcher type="left" patcher={item.leftPatcher || new MaxPat("{}")} />
      <Patcher type="right" patcher={item.rightPatcher || new MaxPat("{}")} />
    </div>
  </div>
{/if}

<style>
  .diff-wrapper {
    box-sizing: border-box;
    overflow-x: auto;
    width: 100%;
    display: block;
  }

  .diff-title {
    position: sticky;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: left;
    margin: 4px 0;
    font-size: 1rem;
    background: #888;
    color: #fff;
    z-index: 10;
  }

  .patcher-wrapper {
    border: 1px solid #000;
    position: relative;
    background: #f0f0f0;
    width: fit-content;
    height: fit-content;
  }
</style>
