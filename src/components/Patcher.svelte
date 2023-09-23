<script lang="ts">
  import { MaxPat } from '../maxpat2svg'
  import { onMount } from "svelte";
  import { diffOpacity } from '../store'
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
  }
</style>