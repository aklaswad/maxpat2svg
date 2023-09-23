<script lang="ts">

  import { selected, showInspector } from '../store'
  import { combineArray, flatten, makeTree, type TreeNode } from '../util';
  import InspectorRow from './InspectorRow.svelte'

  let tree: TreeNode[] = []
  selected.subscribe((selected) => {
    const combined = combineArray(
      o => o.path.join('/'),
      (left, right) => {
        const path = left?.path || right?.path || ['']
        return {
          path,
          item: {left: left?.item, right: right?.item}
        }
      },
      flatten(selected.left || {}),
      flatten(selected.right || {})
    )
    tree = makeTree(combined)
  })

  function closeInspector () {
    $showInspector = false
  }
</script>

<header>
  <button on:click={closeInspector} class="header-item-right">close</button>
</header>
<div id="inspector-content">
  <table>
    {#if tree}
      {#each tree as node}
        <InspectorRow {node} />
      {/each}
    {/if}
  </table>
</div>

<style>
  header {
    position: absolute;
    display: block;
    width: 100%;
    top: 0;
    z-index: 20;
    background: #ddd;
    border-bottom: 1px solid #aaa;
  }

  .header-item-right {
    margin: 3px;
    float: right;
  }
  table {
    margin: 40px 5px;
    display: grid;
    grid-template-columns: minmax(200px, 1fr) 1fr 1fr;
  }

  #inspector-content {
    background: #ddd;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>