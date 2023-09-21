<script lang="ts">
  import DiffItem from './DiffItem.svelte'

  type FileInTree = { path: string[]; item?: any; nodes?: FileInTree[] };
  export let nodes: FileInTree[];
  //  export let tryExtend: boolean = true
</script>

{#each nodes || [] as node}
  <div class="diff-wrapper">
  {#if node.item}
    <DiffItem item={node.item} />
  {/if}
  {#if node.item && node.item.subPatcherTree}
    <svelte:self nodes={node.item.subPatcherTree} />
  {/if}
  </div>
  {#if node.nodes && node.nodes.length}
    <svelte:self nodes={node.nodes} />
  {/if}
{/each}

<style>
  .diff-wrapper {
    box-sizing: border-box;
    width: 100%;
    display: block;
    padding-left: 30px;
  }
</style>