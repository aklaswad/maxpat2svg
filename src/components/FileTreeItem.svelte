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
{item.name}
{#if !item.same}
  {#if item.patchers.left && item.patchers.right}
  <span class="changed modified">&#x22A1;</span>
  {:else if item.patchers.left}
  <span class="changed removed">&#x229F;</span>
  {:else}
  <span class="changed added">&#x229E;</span>
  {/if}
{/if}
</a>

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

.changed {
  position: absolute;
  right: 0;
  margin: 0 5px;
  font-weight: bold;
  font-size: 0.8rem;
}

.added {
  color: #077a07 !important;
}
.modified {
  color: #a09428 !important;
}
.removed {
  color: #d11414 !important;
}
</style>
