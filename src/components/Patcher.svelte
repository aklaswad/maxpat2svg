<script lang="ts">
  import { MaxPat } from '../maxpat2svg'
  import { onMount } from "svelte";
  import { diffOpacity, selecting, selected } from '../store'
  export let patcher: MaxPat | null | undefined
  export let type: 'left' | 'right'

  let div: Element
  onMount( () => {
    if ( patcher ) {
      const svg = patcher.svg()
      div.appendChild(svg)
    }
  })

</script>

{#if patcher}
<div
  class="patcher patcher-{type}"
  class:selecting={$selecting}
  bind:this={div}
  style:opacity={$diffOpacity[type]}
/>
{/if}

<style>
  .patcher {
    mix-blend-mode: multiply;
  }

  .patcher-left {
    position: absolute;
    top: 0;
    color: #b33;
    stroke: #b33;
  }

  .patcher-right {
    color: #383;
    stroke: #383;
    mix-blend-mode: multiply;
  }

  :global(.patcher-left.selecting g.selected) {
    color: #500;
    stroke: #500;
    stroke-width: 2 !important;
  }

  :global(.patcher-right.selecting g.selected) {
    color: #050;
    stroke: #050;
    stroke-width: 2 !important;
  }

  :global(.patcher-left.selecting .selected-connected) {
    color: #d66;
    stroke: #d66;
  }

  :global(.patcher-right.selecting .selected-connected) {
    color: #6d6;
    stroke: #6d6;
  }

  .selecting.patcher-left {
    stroke: #fff8f8;
    color: #fff8f8;
  }

  .selecting.patcher-right {
    stroke: #f8fff8;
    color: #f8fff8;
  }
</style>