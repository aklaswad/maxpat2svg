<script lang="ts">
  import { MaxPat } from '../maxpat2svg'
  import { onMount } from "svelte";
  export let patcher: MaxPat
  export let type: string
  let div: Element

  onMount( () => {
    console.log({patcher,div})
    div.appendChild(patcher.svg())
  })
</script>

<div class="patcher patcher-{type}" bind:this={div} style="$lrOpacity" />

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