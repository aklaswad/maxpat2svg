<script lang="ts">
  import DiffViewListItem from './DiffViewListItem.svelte'
  import { type TreeNode } from '../util';

  export let nodes: TreeNode[];
  //  export let tryExtend: boolean = true
</script>

{#each nodes || [] as node}
  <div class="diff-wrapper">
  {#if node.item}
    <DiffViewListItem item={node.item} />
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