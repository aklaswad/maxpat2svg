<script lang="ts">
  import { type DiffItem } from '../github'
  export let item: DiffItem

  function handleFileNameClick (evt: MouseEvent) {
    if ( !item.select ) return
    item.select()
  }
</script>

<a
  href="#{item.path?.join('/')}"
  on:click|preventDefault={handleFileNameClick}
>
{#if item.isFile}
📄
{:else}
🔖
{/if}
{item.name}</a>

<style>
a {
  display: block;
  font-weight: normal;
  text-decoration: none;
  width: 100%;
  height: 100%;
}

a:hover, a:active {
  background: #ddd;
}
</style>
