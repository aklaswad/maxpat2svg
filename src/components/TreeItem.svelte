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
  on:click={handleFileNameClick}
>{item.name}</a>

<style>
a {
  font-weight: normal;
  text-decoration: none;
}
</style>
