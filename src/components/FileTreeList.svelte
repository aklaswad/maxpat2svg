<script lang="ts">
  type FileInTree =  { path: string[], item?: any, nodes?: FileInTree[] }
  export let nodes: FileInTree[]
</script>

{#each nodes || [] as node}
  <li>
  {#if node.item}
  {node.path}
  {:else}
  {node.path}
      <ul>
        <svelte:self nodes={node.nodes} />
      </ul>
  {/if}
  </li>
{/each}

<style>
  ul {
    padding-left: 10px;
  }

</style>
