<script lang="ts">
  import { type PatcherDiffInfo } from '../maxpat2svg'
  export let info: PatcherDiffInfo | undefined
</script>

{#if info}
  {#if info.status === 'modified'}
    {#if info.boxes.removed.length + info.boxes.modified.length}
      <span class="removed">-{info.boxes.removed.length + info.boxes.modified.length}</span>
    {/if}
    {#if info.boxes.added.length + info.boxes.modified.length}
      <span class="added">+{info.boxes.added.length + info.boxes.modified.length}</span>
    {/if}

    {#if info.attributes.hasDifference}
      <span class="modified">attr has changed</span>
    {/if}
  {:else if info.status === 'added'}
    <span class="added">(new)</span>
  {:else if info.status === 'removed'}
    <span class="removed">(removed)</span>
  {/if}

{/if}

<style>
  .removed {
    margin: 0 2px;
    font-style: italic;
    font-size: 0.8rem;
    color: #f00;
  }

  .added {
    margin: 0 2px;
    font-style: italic;
    font-size: 0.8rem;
    color: #0f0;
  }

  .modified {
    margin: 0 2px;
    font-style: italic;
    font-size: 0.8rem;
    color: #cc0;
  }

</style>