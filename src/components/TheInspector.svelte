<script lang="ts">

  import { selected } from '../store'
</script>

<div id="inspector-content">
  {#if $selected.left}
  <pre id="left">
    { JSON.stringify($selected.left.box, null, 2)}
  </pre>
  {/if}
  {#if $selected.right}
  <pre id="right">
    { JSON.stringify($selected.right.box, null, 2)}
  </pre>
  {/if}
</div>

<style>
  #inspector-content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  #left {
    float: left;
  }

  #right {
    float: right;
  }
</style>