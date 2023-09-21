<script lang="ts">
  import { type DiffItem } from '../github'

  type FileInTree =  { path: string[], item?: any, nodes?: FileInTree[] }
  export let nodes: FileInTree[]
//  export let tryExtend: boolean = true

</script>

{#each nodes || [] as node}
  <li>
    {#if !node.item}📂{node.item?.name || node.path}{:else}
      {#if node.item.isFile}📄{:else}🔖{/if}
        <a href="#{node.item ? node.item.path.join('/') : node.path }">{node.item?.name || node.path}</a>
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

  ul a {
    font-weight: normal;
    text-decoration: none;
  }

</style>
