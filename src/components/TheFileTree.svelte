<script lang="ts">
  import FileTreeItem from './FileTreeItem.svelte'

  type FileInTree =  { path: string[], item?: any, nodes?: FileInTree[] }
  export let nodes: FileInTree[]

</script>

{#each nodes || [] as node}
  <li>
    {#if !node.item}
      📂{node.item?.name || node.path}
    {:else}
      <FileTreeItem item={node.item} />
    {/if}
    {#if node.item && node.item.subPatcherTree}
      <ul>
        <svelte:self nodes={node.item.subPatcherTree} />
      </ul>
    {/if}
    {#if node.nodes && node.nodes.length}
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
