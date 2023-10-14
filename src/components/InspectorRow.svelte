<script lang="ts">
  import { type TreeNode } from "../util"
  import fastDiff from 'fast-diff'
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
  {#if hasDiff}
    {#if node.item.left == null}
      <td class={`${node.item.left == null ? ' null-item' : 'has-diff left'}`}><pre>{stringify(node.item.left)}</pre></td>
      <td class={`${node.item.right == null ? ' null-item' : 'has-diff right'}`}><pre>{stringify(node.item.right)}</pre></td>
    {:else if node.item.right == null}
      <td class={`${node.item.left == null ? ' null-item' : 'has-diff left'}`}><pre>{stringify(node.item.left)}</pre></td>
      <td class={`${node.item.right == null ? ' null-item' : 'has-diff right'}`}><pre>{stringify(node.item.right)}</pre></td>
    {:else}
      {@const diff = fastDiff("" + node.item.left, "" + node.item.right)}
      <td class="left has-diff">
        <pre>{#each diff as chunk}<span class:is-diff-word={chunk[0]}>{
          chunk[0] === 1 ? chunk[1].replace(/[^\r\n]/g,'') : chunk[1]
        }</span>{/each}</pre>
      </td>
      <td class="right has-diff">
        <pre>{#each diff as chunk}<span class:is-diff-word={chunk[0]}>{
            chunk[0] === -1 ? chunk[1].replace(/[^\r\n]/g,'') : chunk[1]
        }</span>{/each}</pre>
      </td>
    {/if}
  {:else}
    <td class={`${node.item.left == null ? ' null-item' : 'left'}`}><pre>{stringify(node.item.left)}</pre></td>
    <td class={`${node.item.right == null ? ' null-item' : 'right'}`}><pre>{stringify(node.item.right)}</pre></td>
  {/if}
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
    background: #fffafa;
    color: #999090;
  }

  td.right {
    background: #fafffa;
    color: #909990;
  }

  td.null-item {
    background: rgba(0,0,0,0.0);
  }

  td.left.has-diff {
    background: #fee;
    color: #977;
  }

  td.right.has-diff {
    background: #efe;
    color: #797;
  }
  .left span.is-diff-word {
    background: #fbb;
    color: #733;
  }

  .right span.is-diff-word {
    background: #bfb;
    color: #373;
  }
</style>