<script lang="ts">
  import { type TreeNode } from "../util";
  export let node: TreeNode
  export let depth = 0

  function stringify(value: any) {
    if (typeof value === "string" || value instanceof String) {
      return `"${value}"`
    }
    if ( typeof value === 'boolean' ) {
      return value ? 'true' : 'false'
    }
    if ( typeof value === 'undefined' ) {
      return 'undefined'
    }
    if ( typeof value === 'object' && value === null ) {
      return 'null'
    }
    if ( typeof value === 'object' || value instanceof Object) {
      return 'object? (something wrong...)'
    }
    return value
  }
</script>

<tr>
{#if node.item == null}
  <th style:padding-left="{depth * 10}px">{node.path}</th>
  {#if node.path === 'patcher'}
    <td class="left">(subpatcher)</td>
    <td class="right">(subpatcher)</td>
  {:else}
    <td></td>
    <td></td>
  {/if}
{:else}
  <th style:padding-left="{depth * 10}px">{node.path}</th>
  {@const hasDiff = !(stringify(node.item.left) === stringify(node.item.right) && typeof node.item.left === typeof node.item.right)}
  <td class={`${node.item.left == null ? ' null-item' : 'left'}`} class:has-diff={hasDiff}><pre>{stringify(node.item.left)}</pre></td>
  <td class={`${node.item.right == null ? ' null-item' : 'right'}`} class:has-diff={hasDiff}><pre>{stringify(node.item.right)}</pre></td>

{/if}
</tr>

{#if node.nodes && node.nodes.length && node.path !== 'patcher'}
  {#each node.nodes as child}
    <svelte:self node={child} depth={depth+1} />
  {/each}
{/if}

<style>
  tr {
    display: contents;
    border: 1px solid #fff;
  }
  th,
  td {
    display: block;
    margin: 2px;
    border-width: 0 0 1px 1px;
    border-color: #333;
  }
  th {
    background: #eee;
    font-weight: bold;
  }

  td pre {
    margin: 0;
    padding: 2px;
    overflow-x: auto;
  }

  td.left {
    background: #fee;
    color: #977;
  }

  td.right {
    background: #efe;
    color: #797;
  }

  td.null-item {
    background: rgba(0,0,0,0.0);
  }

  td.left.has-diff {
    background: #fcc;
    color: #722;
  }

  td.right.has-diff {
    background: #cfc;
    color: #272;
  }

</style>