<script lang="ts">

  import { selecting, selected, selectedDiff, diffItemIndex, showInspector } from '../store'
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
      flatten(selected.left?.box || {}),
      flatten(selected.right?.box || {})
    )
    tree = makeTree(combined)
  })

  function closeInspector () {
    $showInspector = false
    $selecting = false
  }

  function visitSubPatcher () {
    const path = [
      ...($selectedDiff.path || []),
      ($selected.left?.id || $selected.right?.id || '')
    ].join('/')
    const select = $diffItemIndex[path].select
    if ( select ) {
      closeInspector()
      select()
    }
  }
</script>

<header>
  <ul class="target-path">{#each $selectedDiff.path || [] as pathFragment}<li>{pathFragment}</li>{/each}</ul>
  <h1 class="target-id">{$selected.left?.id || $selected.right?.id}</h1>
  {#if $selected.left?.childPatcher || $selected.right?.childPatcher}
  <button on:click={visitSubPatcher}>visit sub patcher</button>
  {/if}
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
    height: 30px;
    top: 0;
    z-index: 20;
    background: #ddd;
    border-bottom: 1px solid #aaa;
    border-top: 1px solid #aaa;
  }

  .header-item-right {
    margin: 3px;
    float: right;
  }

  .target-path {
    margin: 0 3px;
    display: inline-block;
  }

  .target-path li {
    margin: 0 2px;
    display: inline-block;
  }

  .target-path li::after {
    color: #bbb;
    margin: 0 4px;
    content: '>';
  }

  .target-id {
    font-size: 0.8rem;
    display: inline-block;

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